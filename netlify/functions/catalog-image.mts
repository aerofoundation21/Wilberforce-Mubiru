import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const STORE_NAME = "catalog-uploads";

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing image id parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const store = getStore(STORE_NAME);
    const imageBlobKey = `image-${id}`;

    const blob = await store.get(imageBlobKey, { type: "blob" });
    if (!blob) {
      return new Response(JSON.stringify({ error: "Image not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const arrayBuffer = await blob.arrayBuffer();
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": blob.type || "image/jpeg",
        "Cache-Control": "public, max-age=86400, immutable"
      }
    });
  } catch (error: any) {
    console.error("catalog-image function error:", error);
    return new Response(JSON.stringify({ error: error?.message || "Failed to load image" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
