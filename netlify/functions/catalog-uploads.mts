import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

interface CatalogProject {
  id: string;
  title: string;
  client: string;
  tag: string;
  catalog: 'graphics' | 'web-mobile';
  caption: string;
  description: string;
  technique: string;
  materials: string;
  volume: string;
  location: string;
  img: string;
  year: string;
  createdAt?: string;
}

const STORE_NAME = "catalog-uploads";
const INDEX_KEY = "catalog-items.json";

function getExpectedOwnerKey(): string {
  return process.env.CATALOG_UPLOAD_KEY || "rogue_admin_2025";
}

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get("x-owner-key") || req.headers.get("authorization");
  if (!authHeader) return false;
  const cleanHeader = authHeader.replace(/^Bearer\s+/i, "").trim();
  const expectedKey = getExpectedOwnerKey().trim();
  return cleanHeader === expectedKey;
}

export default async (req: Request, _context: Context) => {
  const origin = req.headers.get("origin") || "*";
  const corsHeaders = {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-owner-key",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const store = getStore(STORE_NAME);

    // GET /catalog-uploads: Public read of all uploaded artwork proofs
    if (req.method === "GET") {
      try {
        const items = await store.get(INDEX_KEY, { type: "json" });
        return new Response(JSON.stringify(items || []), {
          status: 200,
          headers: {
            ...corsHeaders,
            "Cache-Control": "public, max-age=15, s-maxage=60"
          }
        });
      } catch (err: any) {
        console.warn("Netlify Blobs get failed (using empty array fallback):", err?.message);
        return new Response(JSON.stringify([]), {
          status: 200,
          headers: corsHeaders
        });
      }
    }

    // POST /catalog-uploads: Owner upload of new artwork proof
    if (req.method === "POST") {
      if (!isAuthorized(req)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Invalid or missing owner key. Set CATALOG_UPLOAD_KEY." }),
          { status: 401, headers: corsHeaders }
        );
      }

      const body = await req.json();
      if (body?.checkOnly) {
        return new Response(
          JSON.stringify({ valid: true, message: "Owner key authenticated" }),
          { status: 200, headers: corsHeaders }
        );
      }

      const {
        title,
        client,
        tag,
        catalog = "graphics",
        caption = "",
        description = "",
        technique = "",
        materials = "",
        volume = "",
        location = "Kampala, Uganda",
        year = new Date().getFullYear().toString(),
        imageData,
        img
      } = body;

      if (!title || !client) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: title and client are mandatory." }),
          { status: 400, headers: corsHeaders }
        );
      }

      const newId = body.id || `custom-${Date.now()}`;
      let finalImgUrl = img || "";

      // Store image binary in blob store if provided as base64 data URL
      if (imageData && typeof imageData === "string" && imageData.startsWith("data:image/")) {
        const matches = imageData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, "base64");
          const imageBlobKey = `image-${newId}`;
          const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;

          await store.set(imageBlobKey, arrayBuffer, {
            metadata: { contentType }
          });
          finalImgUrl = `/.netlify/functions/catalog-image?id=${newId}`;
        }
      }

      if (!finalImgUrl) {
        finalImgUrl = "/portfolio/custom-1790054088985.jpg";
      }

      const newProject: CatalogProject = {
        id: newId,
        title: title.trim(),
        client: client.trim(),
        tag: tag || "Screen Printing",
        catalog: catalog as 'graphics' | 'web-mobile',
        caption: caption.trim() || `${title} production proof`,
        description: description.trim() || `Production proof for ${client}. Authentic print & production run.`,
        technique: technique.trim() || "Screen Printing & Prepress Calibration",
        materials: materials.trim() || "Commercial Garment Textile & Transfer Inks",
        volume: volume.trim() || "Batch Production Run",
        location: location.trim() || "Kampala, Uganda",
        img: finalImgUrl,
        year: year.trim() || new Date().getFullYear().toString(),
        createdAt: new Date().toISOString()
      };

      let existingItems: CatalogProject[] = [];
      try {
        const current = await store.get(INDEX_KEY, { type: "json" });
        if (Array.isArray(current)) {
          existingItems = current as CatalogProject[];
        }
      } catch {
        existingItems = [];
      }

      // Filter out duplicate if updating existing id, then prepend new item
      const updatedList = [newProject, ...existingItems.filter(item => item.id !== newId)];
      await store.setJSON(INDEX_KEY, updatedList);

      return new Response(JSON.stringify({ success: true, item: newProject }), {
        status: 201,
        headers: corsHeaders
      });
    }

    // DELETE /catalog-uploads: Owner deletion of an artwork proof
    if (req.method === "DELETE") {
      if (!isAuthorized(req)) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: Invalid or missing owner key. Set CATALOG_UPLOAD_KEY." }),
          { status: 401, headers: corsHeaders }
        );
      }

      const url = new URL(req.url);
      let targetId = url.searchParams.get("id");

      if (!targetId) {
        try {
          const body = await req.json();
          targetId = body.id;
        } catch {
          // No body
        }
      }

      if (!targetId) {
        return new Response(
          JSON.stringify({ error: "Missing project id to delete." }),
          { status: 400, headers: corsHeaders }
        );
      }

      let existingItems: CatalogProject[] = [];
      try {
        const current = await store.get(INDEX_KEY, { type: "json" });
        if (Array.isArray(current)) {
          existingItems = current as CatalogProject[];
        }
      } catch {
        existingItems = [];
      }

      const filteredList = existingItems.filter(item => item.id !== targetId);
      await store.setJSON(INDEX_KEY, filteredList);

      // Attempt to clean up associated image blob
      try {
        await store.delete(`image-${targetId}`);
      } catch {
        // Non-fatal if image doesn't exist
      }

      return new Response(
        JSON.stringify({ success: true, deletedId: targetId, remaining: filteredList.length }),
        { status: 200, headers: corsHeaders }
      );
    }

    return new Response(JSON.stringify({ error: `Method ${req.method} not allowed` }), {
      status: 405,
      headers: corsHeaders
    });
  } catch (error: any) {
    console.error("catalog-uploads function error:", error);
    return new Response(
      JSON.stringify({ error: error?.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
};
