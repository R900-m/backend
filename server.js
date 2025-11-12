
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Lesson from "./models/Lesson.js";
import Order from "./models/Order.js";

dotenv.config();
const app = express();

// ====== Core middleware ======
app.use(cors());
app.use(express.json());

// ====== A) Logger middleware (prints every request) ======
app.use((req, res, next) => {
  const log = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body
  };
  console.log("[REQUEST]", JSON.stringify(log, null, 2));
  next();
});

// ====== B) Static images with existence check ======
const imagesDir = path.join(process.cwd(), "public", "images");

// If missing file, send JSON error (required by coursework)
app.use("/images", (req, res, next) => {
  const filePath = path.join(imagesDir, req.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Image not found", path: req.path });
  }
  next();
});

// Serve real files when they exist
app.use("/images", express.static(imagesDir));

// ====== Routes ======

// quick health check
app.get("/", (req, res) => {
  res.json({ ok: true, message: "After School Activities API" });
});

// GET /lessons  -> returns all lessons (JSON)
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.find({}).sort({ topic: 1 });
    res.json(lessons);
  } catch (err) {
    console.error("GET /lessons error:", err);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// POST /orders  -> save new order
// body example: { "name":"Alice", "phone":"07123", "items":[{"lessonId":"...","spaces":2}] }
app.post("/orders", async (req, res) => {
  try {
    const { name, phone, items } = req.body;
    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order payload" });
    }
    const order = await Order.create({ name, phone, items });
    res.status(201).json(order);
  } catch (err) {
    console.error("POST /orders error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT /lessons/:id  -> update ANY attribute (e.g. { "space": 3 })
app.put("/lessons/:id", async (req, res) => {
  try {
    const doc = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Lesson not found" });
    res.json(doc);
  } catch (err) {
    console.error("PUT /lessons/:id error:", err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

// ====== Start server after connecting to Mongo ======
const { MONGODB_URI, PORT = 3000 } = process.env;

mongoose
  .connect(MONGODB_URI, { dbName: "after_school_activities" })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Mongo connection error:", err);
    process.exit(1);
  });
