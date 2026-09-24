// Utility for server-side catalog persistence (Netlify Functions & fullstack API) with IndexedDB/localStorage offline fallback
import { ProjectItem } from '../types';

const DB_NAME = 'RogueVenturesCatalogDB';
const DB_VERSION = 1;
const STORE_UPLOADS = 'custom_uploads';
const OWNER_KEY_STORAGE = 'rv_catalog_owner_passkey';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_UPLOADS)) {
        db.createObjectStore(STORE_UPLOADS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Compresses an image file client-side before upload to prevent exceeding payload limits
 */
export async function compressImage(file: File, maxDimension = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Loads custom uploaded projects from server-side store (Netlify Blobs / API)
 * with graceful fallback to IndexedDB and localStorage when offline or initializing
 */
export async function loadCustomUploads(): Promise<ProjectItem[]> {
  let serverItems: ProjectItem[] | null = null;

  // 1. Try server-side endpoints
  const endpoints = ['/.netlify/functions/catalog-uploads', '/api/catalog-uploads'];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          serverItems = data;
          break;
        }
      }
    } catch {
      // Continue to next endpoint or local cache
    }
  }

  // 2. If server responded, cache to local storage for instant offline availability
  if (serverItems !== null) {
    saveToLocalCache(serverItems).catch(() => {});
    return serverItems;
  }

  // 3. Fallback to local IndexedDB & localStorage cache
  return loadFromLocalCache();
}

/**
 * Uploads a new artwork proof to the server-side catalog using the owner passkey
 */
export async function uploadCustomArtwork(
  itemData: Partial<ProjectItem>,
  imageDataUrl: string | undefined,
  ownerKey: string
): Promise<ProjectItem> {
  const payload = {
    ...itemData,
    imageData: imageDataUrl
  };

  const cleanKey = ownerKey.trim();
  const endpoints = ['/.netlify/functions/catalog-uploads', '/api/catalog-uploads'];
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-key': cleanKey,
          Authorization: `Bearer ${cleanKey}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 401) {
        throw new Error('Unauthorized: Invalid owner passkey. Check CATALOG_UPLOAD_KEY.');
      }

      if (res.ok) {
        const result = await res.json();
        if (result && result.item) {
          // Update local cache
          const current = await loadFromLocalCache();
          const updated = [result.item, ...current.filter((p: ProjectItem) => p.id !== result.item.id)];
          await saveToLocalCache(updated);
          return result.item;
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned HTTP ${res.status}`);
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Unauthorized')) {
        throw err;
      }
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to reach catalog upload server. Please try again.');
}

/**
 * Deletes an artwork proof from the server-side catalog using the owner passkey
 */
export async function deleteCustomArtwork(id: string, ownerKey: string): Promise<boolean> {
  const cleanKey = ownerKey.trim();
  const endpoints = [
    `/.netlify/functions/catalog-uploads?id=${encodeURIComponent(id)}`,
    `/api/catalog-uploads/${encodeURIComponent(id)}`,
    `/api/catalog-uploads?id=${encodeURIComponent(id)}`
  ];

  let lastError: Error | null = null;
  let succeeded = false;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-key': cleanKey,
          Authorization: `Bearer ${cleanKey}`
        },
        body: JSON.stringify({ id })
      });

      if (res.status === 401) {
        throw new Error('Unauthorized: Invalid owner passkey. Check CATALOG_UPLOAD_KEY.');
      }

      if (res.ok) {
        succeeded = true;
        break;
      }
    } catch (err: any) {
      if (err.message && err.message.includes('Unauthorized')) {
        throw err;
      }
      lastError = err;
    }
  }

  if (!succeeded && lastError) {
    throw lastError;
  }

  // Remove from local cache
  const current = await loadFromLocalCache();
  const updated = current.filter((p: ProjectItem) => p.id !== id);
  await saveToLocalCache(updated);

  return true;
}

/**
 * Local cache helpers
 */
async function saveToLocalCache(items: ProjectItem[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_UPLOADS, 'readwrite');
    const store = tx.objectStore(STORE_UPLOADS);
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        if (items.length === 0) return resolve();
        let count = 0;
        for (const item of items) {
          const req = store.put(item);
          req.onsuccess = () => {
            count++;
            if (count === items.length) resolve();
          };
          req.onerror = () => reject(req.error);
        }
      };
      clearReq.onerror = () => reject(clearReq.error);
    });
  } catch {
    // ignore
  }

  try {
    localStorage.setItem('rv_user_custom_uploads_v5', JSON.stringify(items));
  } catch {
    // ignore
  }
}

async function loadFromLocalCache(): Promise<ProjectItem[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_UPLOADS, 'readonly');
    const store = tx.objectStore(STORE_UPLOADS);
    return await new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        if (req.result && req.result.length > 0) {
          resolve(req.result);
        } else {
          const saved = localStorage.getItem('rv_user_custom_uploads_v5') || localStorage.getItem('rv_user_custom_uploads_v4');
          resolve(saved ? JSON.parse(saved) : []);
        }
      };
      req.onerror = () => {
        const saved = localStorage.getItem('rv_user_custom_uploads_v5') || localStorage.getItem('rv_user_custom_uploads_v4');
        resolve(saved ? JSON.parse(saved) : []);
      };
    });
  } catch {
    const saved = localStorage.getItem('rv_user_custom_uploads_v5') || localStorage.getItem('rv_user_custom_uploads_v4');
    return saved ? JSON.parse(saved) : [];
  }
}

/**
 * Stub for obsolete image overrides as documented in specs
 */
export async function loadImageOverrides(): Promise<Record<string, string>> {
  return {};
}

export async function saveImageOverride(_id: string, _dataUrl: string): Promise<void> {
  // Deprecated stub
}

export async function saveCustomUploads(items: ProjectItem[]): Promise<void> {
  await saveToLocalCache(items);
}

/**
 * Saved Owner Passkey in browser localStorage for convenient management
 */
export function getSavedOwnerKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(OWNER_KEY_STORAGE) || '';
}

export function saveOwnerKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key) {
    localStorage.removeItem(OWNER_KEY_STORAGE);
  } else {
    localStorage.setItem(OWNER_KEY_STORAGE, key.trim());
  }
}

/**
 * Validates the owner key against the server-side endpoint or local default key
 */
export async function verifyOwnerKey(key: string): Promise<boolean> {
  const cleanKey = key.trim();
  if (!cleanKey) return false;

  const endpoints = ['/.netlify/functions/catalog-uploads', '/api/catalog-uploads'];
  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-owner-key': cleanKey,
          Authorization: `Bearer ${cleanKey}`
        },
        body: JSON.stringify({ checkOnly: true })
      });
      if (res.ok) {
        saveOwnerKey(cleanKey);
        return true;
      }
      if (res.status === 401) {
        return false;
      }
    } catch {
      // Continue to next endpoint or fallback check
    }
  }

  // Fallback dev key comparison if server was unreachable
  if (cleanKey === 'rogue_admin_2025' || cleanKey === 'rogue_ventures_secret_key') {
    saveOwnerKey(cleanKey);
    return true;
  }

  return false;
}

