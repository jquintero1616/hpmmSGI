// server.ts
import "dotenv/config";
import app from "./app";

// 1) Habilitamos trust proxy para que Express lea X-Forwarded-For
app.set("trust proxy", true);

const PORT: number = parseInt(process.env.PORT ?? "3000", 10) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  const localUrl = `http://localhost:${PORT}`;
  console.info("\n Express App Running...");
  console.info(`\n -> Local: ${localUrl}/api \n`);
});
