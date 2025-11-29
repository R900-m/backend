import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// --- Connect to MongoDB ---
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("after_school_activities");

console.log("MongoDB connected successfully!");

// ----- GET /lessons -----
app.get("/lessons", async (req, res) => {
  const lessons = await db.collection("lessons").find().toArray();
  res.json(lessons);
});

// ----- POST /orders -----
app.post("/orders", async (req, res) => {
  const order = req.body;
  const result = await db.collection("orders").insertOne(order);
  res.status(201).json(result);
});

// ----- PUT /lessons/:id -----
app.put("/lessons/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const updated = await db.collection("lessons").findOneAndUpdate(
    { _id: id },
    { $set: req.body },
    { returnDocument: "after" }
  );

  if (!updated.value) return res.status(404).json({ error: "Lesson not found" });

  res.json(updated.value);
});

// ---- Start server ----
app.listen(process.env.PORT, () => {
  console.log("API running on port " + process.env.PORT);
});
