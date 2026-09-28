import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";

/**
 * GET/POST/DELETE /api/<host>/waInstance… → https://<host>/waInstance…
 */
export function greenApiDevProxyPlugin(): Plugin {
  return {
    name: "green-api-dev-proxy",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url;
        if (!rawUrl?.startsWith("/api/")) {
          next();
          return;
        }

        const withoutPrefix = rawUrl.slice("/api".length);
        const pathOnly = withoutPrefix.split("?")[0] ?? "";
        const query = rawUrl.includes("?") ? rawUrl.slice(rawUrl.indexOf("?")) : "";
        const segments = pathOnly.split("/").filter(Boolean);
        const host = segments[0];
        if (!host || !host.includes(".")) {
          res.statusCode = 400;
          res.end("Expected /api/<host>/waInstance…");
          return;
        }

        const upstreamPath = `/${segments.slice(1).join("/")}${query}`;
        const target = `https://${host}${upstreamPath}`;

        try {
          const body = await readBody(req);
          const headers = new Headers();
          const contentType = req.headers["content-type"];
          if (typeof contentType === "string") {
            headers.set("Content-Type", contentType);
          }

          const response = await fetch(target, {
            method: req.method,
            headers,
            body: body && body.length > 0 ? new Uint8Array(body) : undefined,
          });

          res.statusCode = response.status;
          response.headers.forEach((value, key) => {
            const lower = key.toLowerCase();
            if (lower === "transfer-encoding" || lower === "connection") {
              return;
            }
            res.setHeader(key, value);
          });
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          res.statusCode = 502;
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.end(error instanceof Error ? error.message : "Proxy error");
        }
      });
    },
  };
}

function readBody(req: IncomingMessage): Promise<Buffer | undefined> {
  if (req.method === "GET" || req.method === "HEAD") {
    return Promise.resolve(undefined);
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(chunks.length > 0 ? Buffer.concat(chunks) : undefined));
    req.on("error", reject);
  });
}
