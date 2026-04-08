// server.ts
// Run with: deno run --allow-net --allow-read server.ts

const PORT = 8000;
const DB = new Map(); // In-memory database for testing

console.log(`Http server running on http://localhost:${PORT}/`);

Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // --- API ROUTES ---
  
  // GET /api/data
  if (path === "/api/data" && req.method === "GET") {
    const data = Array.from(DB.values());
    return Response.json(data);
  }

  // POST /api/data
  if (path === "/api/data" && req.method === "POST") {
    const item = await req.json();
    const id = crypto.randomUUID();
    DB.set(id, { id, ...item });
    return Response.json({ status: "created", id });
  }
  
  // DELETE /api/data/:id
  if (path.startsWith("/api/data/") && req.method === "DELETE") {
    const id = path.split("/").pop();
    DB.delete(id);
    return Response.json({ status: "deleted" });
  }

  // --- STATIC FILE SERVING ---
  
  // Map "/" to "index.html"
  const file = path === "/" ? "index.html" : `.${path}`;
  
  try {
    // Try to find the file on disk
    const content = await Deno.readFile(file);
    
    // Determine mime type (simple version)
    const ext = file.split(".").pop();
    const types: Record<string, string> = {
      "html": "text/html",
      "js": "text/javascript",
      "css": "text/css",
      "json": "application/json"
    };
    
    return new Response(content, {
      headers: { "content-type": types[ext] || "text/plain" }
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
});
