import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const DATA_DIR = path.resolve(__dirname, 'data');
const CATALOG_FILE = path.resolve(DATA_DIR, 'catalog-uploads.json');
const IMAGES_DIR = path.resolve(DATA_DIR, 'images');

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(CATALOG_FILE)) {
  fs.writeFileSync(CATALOG_FILE, JSON.stringify([], null, 2), 'utf-8');
}

function getExpectedOwnerKey(): string {
  return process.env.CATALOG_UPLOAD_KEY || 'rogue_admin_2025';
}

function isAuthorized(req: Request): boolean {
  const authHeader = (req.headers['x-owner-key'] || req.headers['authorization']) as string | undefined;
  if (!authHeader) return false;
  const cleanHeader = authHeader.replace(/^Bearer\s+/i, '').trim();
  const expectedKey = getExpectedOwnerKey().trim();
  return cleanHeader === expectedKey;
}

function readCatalog(): any[] {
  try {
    if (fs.existsSync(CATALOG_FILE)) {
      const data = fs.readFileSync(CATALOG_FILE, 'utf-8');
      return JSON.parse(data) || [];
    }
  } catch (err) {
    console.error('Error reading catalog file:', err);
  }
  return [];
}

function saveCatalog(items: any[]): void {
  try {
    fs.writeFileSync(CATALOG_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving catalog file:', err);
  }
}

async function startServer() {
  const app = express();

  // Support large base64 uploads for artwork images
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // CORS and pre-flight handling
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-owner-key');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Handler for GET catalog items
  const handleGetCatalog = (_req: Request, res: Response) => {
    const items = readCatalog();
    res.setHeader('Cache-Control', 'public, max-age=15, s-maxage=60');
    return res.json(items);
  };

  // Handler for POST catalog item
  const handlePostCatalog = (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or missing owner key. Configure CATALOG_UPLOAD_KEY or provide valid passkey.'
      });
    }

    if (req.body?.checkOnly) {
      return res.status(200).json({ valid: true, message: 'Owner key authenticated' });
    }

    const {
      title,
      client,
      tag,
      catalog = 'graphics',
      caption = '',
      description = '',
      technique = '',
      materials = '',
      volume = '',
      location = 'Kampala, Uganda',
      year = new Date().getFullYear().toString(),
      imageData,
      img
    } = req.body;

    if (!title || !client) {
      return res.status(400).json({ error: 'Missing required fields: title and client are mandatory.' });
    }

    const newId = req.body.id || `custom-${Date.now()}`;
    let finalImgUrl = img || '';

    if (imageData && typeof imageData === 'string' && imageData.startsWith('data:image/')) {
      const matches = imageData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const ext = mimeType.includes('png') ? 'png' : mimeType.includes('svg') ? 'svg' : 'jpg';
        const filename = `image-${newId}.${ext}`;
        const filePath = path.resolve(IMAGES_DIR, filename);

        try {
          fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
          finalImgUrl = `/api/catalog-image/${newId}`;
        } catch (err) {
          console.error('Failed to write image file:', err);
          finalImgUrl = imageData; // fallback inline
        }
      }
    }

    if (!finalImgUrl) {
      finalImgUrl = '/portfolio/custom-1790054088985.jpg';
    }

    const newProject = {
      id: newId,
      title: title.trim(),
      client: client.trim(),
      tag: tag || 'Screen Printing',
      catalog: catalog as 'graphics' | 'web-mobile',
      caption: caption.trim() || `${title} production proof`,
      description: description.trim() || `Production proof for ${client}. Authentic print & production run.`,
      technique: technique.trim() || 'Screen Printing & Prepress Calibration',
      materials: materials.trim() || 'Commercial Garment Textile & Transfer Inks',
      volume: volume.trim() || 'Batch Production Run',
      location: location.trim() || 'Kampala, Uganda',
      img: finalImgUrl,
      year: year.trim() || new Date().getFullYear().toString(),
      createdAt: new Date().toISOString()
    };

    const currentItems = readCatalog();
    const updated = [newProject, ...currentItems.filter(p => p.id !== newId)];
    saveCatalog(updated);

    return res.status(201).json({ success: true, item: newProject });
  };

  // Handler for DELETE catalog item
  const handleDeleteCatalog = (req: Request, res: Response) => {
    if (!isAuthorized(req)) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or missing owner key. Set CATALOG_UPLOAD_KEY.'
      });
    }

    const targetId = (req.query.id as string) || (req.params.id as string) || req.body?.id;
    if (!targetId) {
      return res.status(400).json({ error: 'Missing project id to delete.' });
    }

    const currentItems = readCatalog();
    const updated = currentItems.filter(p => p.id !== targetId);
    saveCatalog(updated);

    // Clean up image file if exists
    ['jpg', 'png', 'svg', 'webp'].forEach(ext => {
      const file = path.resolve(IMAGES_DIR, `image-${targetId}.${ext}`);
      if (fs.existsSync(file)) {
        try { fs.unlinkSync(file); } catch { /* ignore */ }
      }
    });

    return res.json({ success: true, deletedId: targetId, remaining: updated.length });
  };

  // Handler for serving images
  const handleGetImage = (req: Request, res: Response) => {
    const id = (req.params.id || req.query.id) as string;
    if (!id) {
      return res.status(400).json({ error: 'Missing image id' });
    }

    for (const ext of ['jpg', 'png', 'svg', 'webp']) {
      const filePath = path.resolve(IMAGES_DIR, `image-${id}.${ext}`);
      if (fs.existsSync(filePath)) {
        const mime = ext === 'png' ? 'image/png' : ext === 'svg' ? 'image/svg+xml' : 'image/jpeg';
        res.setHeader('Content-Type', mime);
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
        return res.sendFile(filePath);
      }
    }

    return res.status(404).json({ error: 'Image not found' });
  };

  // Register endpoints for both standard /api/* and /.netlify/functions/* paths
  app.get('/api/catalog-uploads', handleGetCatalog);
  app.get('/.netlify/functions/catalog-uploads', handleGetCatalog);

  app.post('/api/catalog-uploads', handlePostCatalog);
  app.post('/.netlify/functions/catalog-uploads', handlePostCatalog);

  app.delete('/api/catalog-uploads/:id', handleDeleteCatalog);
  app.delete('/api/catalog-uploads', handleDeleteCatalog);
  app.delete('/.netlify/functions/catalog-uploads', handleDeleteCatalog);

  app.get('/api/catalog-image/:id', handleGetImage);
  app.get('/api/catalog-image', handleGetImage);
  app.get('/.netlify/functions/catalog-image', handleGetImage);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Mount Vite middleware in development mode
  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (Mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
