// server.ts
import "dotenv/config";
import app from "./app";
import https from "https";
import fs from "fs";
import path from "path";

// 1) Habilitamos trust proxy para que Express lea X-Forwarded-For
app.set("trust proxy", true);

const PORT: number = parseInt(process.env.PORT ?? "3000", 10) || 3000;

// Lee los certificados SSL
const key = fs.readFileSync(path.resolve(__dirname, "../certs/key.pem"));
const cert = fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem"));

https.createServer({ key, cert }, app).listen(PORT, "0.0.0.0", () => {
  const localUrl = `https://localhost:${PORT}`;
  console.info("\n Express App Running (HTTPS)...");
  console.info(`\n -> Local: ${localUrl}/api \n`);
});
