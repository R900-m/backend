import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import Lesson from "./models/Lesson.js";  // Make sure file is EXACTLY Lesson.js
import Order from "./models/Order.js";    // Make sure file is EXACTLY Order.js

dotenv.config();
const app = express();

// ---------------------- Core Middleware ----------------------
app.use(cors());
app.use(express.json());

// ---------------------- Logger (Required by Coursework) ----------------------
app.use((req, res, next) => {
  const log = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body
  };

  console.log("\n========== REQUEST ==========");
  console.log(JSON.stringify(log, null, 2));
  console.log("================================\n");

  next();
});

// ---------------------- Image Middleware ----------------------
const imagesDir = path.join(process.cwd(), "public", "images");

// Check image exists (required by coursework)
app.use("/images", (req, res, next) => {
  const filePath = path.join(imagesDir, req.path);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: "Image not found",
      path: req.path
    });
  }

  next();
});

// Serve actual image files
app.use("/images", express.static(imagesDir));

// ---------------------- Routes ----------------------

// Health check route
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "After School Activities API running 🚀"
  });
});

// GET /lessons  -> return all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.find({}).sort({ topic: 1 });
    res.json(lessons);
  } catch (err) {
    console.error("GET /lessons error:", err);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// GET /lessons/:id -> return a single lesson by ID
app.get("/lessons/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    console.error("GET /lessons/:id error:", err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});


// POST /orders -> create an order
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

// PUT /lessons/:id -> update lesson space or other fields
app.put("/lessons/:id", async (req, res) => {
  try {
    const updated = await Lesson.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("PUT /lessons/:id error:", err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

// ---------------------- MongoDB Connection ----------------------
const { MONGODB_URI, PORT = 3000 } = process.env;

mongoose
  .connect(MONGODB_URI, {
    dbName: "after_school_activities"
  })
  .then(() => {
    console.log("📦 MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 API running at: http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
