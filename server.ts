// deno run --allow-net --allow-read server.ts

const PORT = 8000;

const MIME: Record<string, string> = {
  html: "text/html",
  js:   "text/javascript",
  css:  "text/css",
  json: "application/json",
};

console.log(`http://localhost:${PORT}/`);

Deno.serve({ port: PORT }, async (req) => {
  const path = new URL(req.url).pathname;
  const file = path === "/" ? "test.html" : `.${path}`;

  try {
    const content = await Deno.readFile(file);
    const ext = file.split(".").pop() ?? "";
    return new Response(content, {
      headers: { "content-type": MIME[ext] ?? "text/plain" },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
});
