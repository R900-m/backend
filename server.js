// =========================
// After School Activities API (Native MongoDB Only)
// =========================

import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

// Environment variables
const { MONGODB_URI, PORT = 3000 } = process.env;

// Global DB collections
let lessonsCollection;
let ordersCollection;

// ---------------------------
// Middleware: CORS + JSON
// ---------------------------
app.use(cors());
app.use(express.json());

// ---------------------------
// Logger Middleware (Required)
// ---------------------------
app.use((req, res, next) => {
  const log = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body
  };

  console.log("\n===== REQUEST =====");
  console.log(JSON.stringify(log, null, 2));
  console.log("===================\n");

  next();
});

// ---------------------------
// Image Middleware
// ---------------------------
const imagesDir = path.join(process.cwd(), "public", "images");

app.use("/images", (req, res, next) => {
  const filePath = path.join(imagesDir, req.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Image not found", path: req.path });
  }
  next();
});

app.use("/images", express.static(imagesDir));

// ---------------------------
// ROUTES
// ---------------------------

// Health check
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "After School Activities API running 🚀"
  });
});

// GET all lessons
app.get("/lessons", async (req, res) => {
  try {
    const lessons = await lessonsCollection.find({}).sort({ topic: 1 }).toArray();
    res.json(lessons);
  } catch (err) {
    console.error("GET /lessons error:", err);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// GET lesson by ID
app.get("/lessons/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid lesson ID format" });
    }

    const lesson = await lessonsCollection.findOne({ _id: new ObjectId(id) });

    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(lesson);
  } catch (err) {
    console.error("GET /lessons/:id error:", err);
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
});

// POST create order
app.post("/orders", async (req, res) => {
  try {
    const { name, phone, items } = req.body;

    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const order = { name, phone, items };
    const result = await ordersCollection.insertOne(order);

    res.json({
      message: "Order created successfully",
      orderId: result.insertedId
    });

  } catch (err) {
    console.error("POST /orders error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT update lesson
app.put("/lessons/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid lesson ID format" });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No updates provided" });
    }

    const result = await lessonsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json({
      message: "Lesson updated successfully",
      updated: updates
    });

  } catch (err) {
    console.error("PUT /lessons/:id error:", err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

// ---------------------------
// CONNECT TO MONGODB & START SERVER
// ---------------------------
async function startServer() {
  try {
    console.log("Connecting to MongoDB...");

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("MongoDB connected using native driver");

    const db = client.db("after_school_activities");

    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");

    app.listen(PORT, () => {
      console.log(`🚀 API running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("Server start error:", err);
  }
}

startServer();
