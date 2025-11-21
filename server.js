// Backend server configuration - Coursework Version 2025
// Uses ONLY native MongoDB driver

//////////////////// Imports ////////////////////
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

// Read connection string + port from environment
// (locally from .env, on Render from Environment tab)
const { MONGODB_URI, PORT = 3000 } = process.env;

// Global collection variables (set after Mongo connects)
let lessonsCollection;
let ordersCollection;

//////////////////// Core Middleware ////////////////////
app.use(cors());
app.use(express.json()); // parse JSON bodies

//////////////////// Logger Middleware ////////////////////
app.use((req, res, next) => {
  const log = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
  };

  console.log("\n========== REQUEST ==========");
  console.log(JSON.stringify(log, null, 2));
  console.log("================================\n");

  next();
});

//////////////////// Image Middleware ////////////////////

// Public images live in Back-end/public/images
const imagesDir = path.join(process.cwd(), "public", "images");

// Check image exists and return 404 JSON if it doesn't
app.use("/images", (req, res, next) => {
  const filePath = path.join(imagesDir, req.path);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      error: "Image not found",
      path: req.path,
    });
  }
  next();
});

// Serve image files
app.use("/images", express.static(imagesDir));

//////////////////// Routes ////////////////////

// Health check (used by browser + Render)
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "After School Activities API running 🚀",
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

// GET single lesson by ID
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

    // Simple validation
    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    const order = {
      name,
      phone,
      items,
      createdAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);

    res.status(201).json({ ...order, _id: result.insertedId });
  } catch (err) {
    console.error("POST /orders error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// PUT update lesson (used for your PUT request in Postman)
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
      { returnDocument: "after" } // return the updated document
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

//////////////////// OPTIONAL: Reseed Route (no Render Shell) ////////////////////
// This lets you reset lessons directly from Postman instead of using `node seed.js`.
// Use it carefully: it DELETES all lessons and re-inserts the defaults.

const seedLessons = [
  { topic: "Art",          location: "Golders Green", price: 85,  space: 5, image: "/images/art.jpg" },
  { topic: "Coding",       location: "Barnet",        price: 120, space: 5, image: "/images/coding.jpg" },
  { topic: "Dance",        location: "Mill Hill",     price: 75,  space: 5, image: "/images/Dance.jpg" },
  { topic: "Drama",        location: "Camden",        price: 80,  space: 5, image: "/images/Drama.jpg" },
  { topic: "English",      location: "Colindale",     price: 90,  space: 5, image: "/images/english.jpg" },
  { topic: "Math",         location: "Hendon",        price: 100, space: 1, image: "/images/math.jpg" },
  { topic: "Music",        location: "Finchley",      price: 95,  space: 5, image: "/images/music.jpg" },
  { topic: "Photography",  location: "Hampstead",     price: 105, space: 5, image: "/images/photography.jpg" },
  { topic: "Robotics",     location: "Cricklewood",   price: 130, space: 5, image: "/images/robotics.jpg" },
  { topic: "Science",      location: "Brent",         price: 110, space: 1, image: "/images/science.jpg" },
];

// Example call from Postman:
// POST https://backend-1-sits.onrender.com/admin/reseed?token=secret123
app.post("/admin/reseed", async (req, res) => {
  try {
    const token = req.query.token;
    if (token !== "secret123") {
      return res.status(403).json({ error: "Forbidden" });
    }

    await lessonsCollection.deleteMany({});
    const result = await lessonsCollection.insertMany(seedLessons);

    res.json({
      ok: true,
      message: "Database reseeded",
      insertedCount: result.insertedCount,
    });
  } catch (err) {
    console.error("POST /admin/reseed error:", err);
    res.status(500).json({ error: "Failed to reseed database" });
  }
});

//////////////////// MongoDB Connection + Start Server ////////////////////
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
