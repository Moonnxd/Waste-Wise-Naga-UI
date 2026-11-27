import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import requestsRouter from "./routes/requests.js";
import { loadRequests } from "./storage/requests.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(here, "..");
const uploadDir = path.join(backendRoot, "uploads");
const app = express();
const port = Number(process.env.PORT || 3001);

await fs.mkdir(uploadDir, { recursive: true });
await loadRequests();

app.use(cors({ origin: [/^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/] }));
app.use(express.json());
app.use("/uploads", express.static(uploadDir));
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/requests", requestsRouter);

app.use((error, _req, res, _next) => {
  if (error instanceof Error && error.name === "MulterError") {
    return res.status(400).json({ error: error.code === "LIMIT_FILE_SIZE" ? "Image must be 8 MB or smaller." : error.message });
  }
  if (error.message === "Please upload an image file.") return res.status(400).json({ error: error.message });
  console.error(error);
  res.status(500).json({ error: "The request could not be saved." });
});

app.listen(port, () => console.log(`Waste Wise demo API listening at http://localhost:${port}`));
