import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { createPlan } from "./api/create-plan.js";
import { createIllustration } from "./api/create-illustration.js";

const root = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(root, "public");
const port = Number(process.env.PORT || 4177);
const host = process.env.HOST || "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg"
};

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

async function routeApi(req, res) {
  try {
    const body = await readJson(req);
    if (req.url === "/api/create-plan") {
      return sendJson(res, 200, await createPlan(body));
    }
    if (req.url === "/api/create-illustration") {
      return sendJson(res, 200, await createIllustration(body));
    }
    return sendJson(res, 404, { error: "Unknown API route" });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Request failed" });
  }
}

async function serveStatic(req, res) {
  const requested = req.url === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const safePath = normalize(requested).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  try {
    const contents = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    res.end(contents);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

http.createServer((req, res) => {
  if (req.method === "POST" && req.url?.startsWith("/api/")) return routeApi(req, res);
  if (req.method === "GET") return serveStatic(req, res);
  res.writeHead(405);
  res.end("Method not allowed");
}).listen(port, host, () => {
  console.log(`Packing Atelier Codex running at http://${host}:${port}`);
});
