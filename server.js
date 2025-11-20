// Backend server configuration - Coursework Version 2025
// Uses ONLY native MongoDB driver (NO mongoose)

// ---------------- Imports ----------------
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

const { MONGODB_URI, PORT = 3000 } = process.env;

// Global collection variables
let lessonsCollection;
let ordersCollection;

// ---------------- Core Middleware ----------------
app.use(cors());
app.use(express.json());

// ---------------- Logger Middleware ----------------
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

// ---------------- Image Middleware ----------------
const imagesDir = path.join(process.cwd(), "public", "images");

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

app.use("/images", express.static(imagesDir));

// ---------------- Routes ----------------

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

    let lesson;
    try {
      lesson = await lessonsCollection.findOne({ _id: new ObjectId(id) });
    } catch {
      return res.status(400).json({ error: "Invalid lesson ID format" });
    }

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
      return res.status(400).json({ error: "Invalid order payload" });
    }

    const order = {
      name,
      phone,
      items,
      createdAt: new Date()
    };

    const result = await ordersCollection.insertOne(order);

    res.status(201).json({ ...order, _id: result.insertedId });
  } catch (err) {
    console.error("POST /orders error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT update lesson
app.put("/lessons/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let updateFilter;
    try {
      updateFilter = { _id: new ObjectId(id) };
    } catch {
      return res.status(400).json({ error: "Invalid lesson ID format" });
    }

    const update = { $set: req.body };

    const result = await lessonsCollection.findOneAndUpdate(
      updateFilter,
      update,
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    res.json(result.value);
  } catch (err) {
    console.error("PUT /lessons/:id error:", err);
    res.status(500).json({ error: "Failed to update lesson" });
  }
});

// ---------------- MongoDB Connection ----------------
async function startServer() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db("after_school_activities");

    lessonsCollection = db.collection("lessons");
    ordersCollection = db.collection("orders");

    console.log("✅ MongoDB connected using native driver");

    app.listen(PORT, () => {
      console.log(`🚀 API running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

startServer();
