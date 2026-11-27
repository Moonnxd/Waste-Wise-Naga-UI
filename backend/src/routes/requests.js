import { Router } from "express";
import multer from "multer";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { addRequest, listRequests } from "../storage/requests.js";

const router = Router();
const uploadDir = path.resolve("uploads");
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename(_req, file, callback) {
      callback(null, `${Date.now()}-${randomUUID()}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter(_req, file, callback) {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Please upload an image file."));
    }
    callback(null, true);
  },
});

router.get("/", (_req, res) => {
  res.json({ requests: listRequests() });
});

router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "An image is required (field: image)." });

    const value = (key, fallback = "") => String(req.body[key] ?? fallback).trim();
    const request = {
      id: `WWN-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
      residentName: value("residentName", "Demo Resident"),
      barangay: value("barangay", "Concepcion Pequeña"),
      address: value("address", "Concepcion Pequeña, Naga City"),
      wasteType: value("wasteType", "Mixed dry waste"),
      estimatedVolume: value("estimatedVolume", "0.42 m³"),
      estimatedWeight: value("estimatedWeight", "31 kg"),
      confidence: value("confidence", "94%"),
      truckId: value("truckId", "NCG-214"),
      status: "Received",
      imageUrl: `/uploads/${req.file.filename}`,
      imageName: req.file.originalname,
      createdAt: new Date().toISOString(),
    };

    await addRequest(request);
    res.status(201).json({ request });
  } catch (error) {
    next(error);
  }
});

export default router;
