// Utility for compressing images and storing them reliably in IndexedDB & localStorage

const DB_NAME = 'RogueVenturesCatalogDB';
const DB_VERSION = 1;
const STORE_UPLOADS = 'custom_uploads';
const STORE_OVERRIDES = 'image_overrides';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_UPLOADS)) {
        db.createObjectStore(STORE_UPLOADS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_OVERRIDES)) {
        db.createObjectStore(STORE_OVERRIDES, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Compresses an image file to prevent exceeding browser storage limits
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
 * Saves all custom uploaded projects to IndexedDB & localStorage
 */
export async function saveCustomUploads(items: any[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_UPLOADS, 'readwrite');
    const store = tx.objectStore(STORE_UPLOADS);
    await new Promise<void>((resolve, reject) => {
      const clearReq = store.clear();
      clearReq.onsuccess = () => {
        if (items.length === 0) {
          resolve();
          return;
        }
        let completed = 0;
        for (const item of items) {
          const req = store.put(item);
          req.onsuccess = () => {
            completed++;
            if (completed === items.length) resolve();
          };
          req.onerror = () => reject(req.error);
        }
      };
      clearReq.onerror = () => reject(clearReq.error);
    });
  } catch (err) {
    console.warn('IndexedDB failed, falling back to localStorage', err);
  }

  // Backup to localStorage
  try {
    localStorage.setItem('rv_user_custom_uploads_v5', JSON.stringify(items));
  } catch (err) {
    console.warn('localStorage quota warning', err);
  }
}

/**
 * Loads custom uploaded projects from IndexedDB or localStorage
 */
export async function loadCustomUploads(): Promise<any[]> {
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
          // Check fallback
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
 * Saves image overrides
 */
export async function saveImageOverride(id: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_OVERRIDES, 'readwrite');
    const store = tx.objectStore(STORE_OVERRIDES);
    store.put({ id, dataUrl });
  } catch (err) {
    console.warn('IndexedDB override failed', err);
  }

  try {
    const saved = localStorage.getItem('rv_user_image_overrides_v1');
    const parsed = saved ? JSON.parse(saved) : {};
    parsed[id] = dataUrl;
    localStorage.setItem('rv_user_image_overrides_v1', JSON.stringify(parsed));
  } catch {
    // ignore
  }
}

/**
 * Loads all image overrides
 */
export async function loadImageOverrides(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_OVERRIDES, 'readonly');
    const store = tx.objectStore(STORE_OVERRIDES);
    return await new Promise((resolve) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const map: Record<string, string> = {};
        if (req.result) {
          for (const item of req.result) {
            map[item.id] = item.dataUrl;
          }
        }
        // Also merge localStorage
        try {
          const saved = localStorage.getItem('rv_user_image_overrides_v1');
          if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(map, parsed);
          }
        } catch {
          // ignore
        }
        resolve(map);
      };
      req.onerror = () => {
        try {
          const saved = localStorage.getItem('rv_user_image_overrides_v1');
          resolve(saved ? JSON.parse(saved) : {});
        } catch {
          resolve({});
        }
      };
    });
  } catch {
    try {
      const saved = localStorage.getItem('rv_user_image_overrides_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }
}
