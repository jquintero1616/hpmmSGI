// server.ts
import "dotenv/config";
import app from "./app";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

// 1) Habilitamos trust proxy para que Express lea X-Forwarded-For
app.set("trust proxy", true);


const USE_HTTPS = process.env.USE_HTTPS === "true";
let portToUse = parseInt(process.env.PORT ?? (USE_HTTPS ? "8443" : "3000"), 10) || (USE_HTTPS ? 8443 : 3000);

if (USE_HTTPS) {
  // PRODUCCIÓN - HTTPS (puerto alto para no-root)
  const key = fs.readFileSync(path.resolve(__dirname, "../certs/key.pem"));
  const cert = fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem"));
  https.createServer({ key, cert }, app).listen(portToUse, "0.0.0.0", () => {
    const localUrl = `https://localhost:${portToUse}`;
    console.info("\n Express App Running (HTTPS)...");
    console.info(`\n -> Local: ${localUrl}/api \n`);
    console.info(`[DEBUG] Servidor HTTPS escuchando en 0.0.0.0:${portToUse}`);
  });
} else {
  // DESARROLLO - HTTP
  http.createServer(app).listen(portToUse, "0.0.0.0", () => {
    const localUrl = `http://localhost:${portToUse}`;
    console.info("\n Express App Running (HTTP - Desarrollo)...");
    console.info(`\n -> Local: ${localUrl}/api \n`);
  });
}
