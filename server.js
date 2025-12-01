// ---------------- Imports ----------------
import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// ---------------- App Setup ----------------
const app = express();
app.use(cors());
app.use(express.json()); // IMPORTANT for POST & PUT

// ---------------- MongoDB Setup ----------------
const client = new MongoClient(process.env.MONGODB_URI);

let lessonsCollection;
let ordersCollection;

async function start() {
    try {
        await client.connect();
        console.log("Connected to MongoDB ✔");

        const db = client.db("Coursework"); // your database name
        lessonsCollection = db.collection("lessons");
        ordersCollection = db.collection("orders");

        // Start server AFTER DB is ready
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`API running on port ${PORT}`));

    } catch (err) {
        console.error("DB connection error:", err);
    }
}

start();

// ---------------- ROUTES ----------------

/*
    ===========================
    1. GET ALL LESSONS
    ===========================
*/
app.get("/lessons", async (req, res) => {
    try {
        const lessons = await lessonsCollection.find({}).toArray();
        res.json(lessons); // ✔ FIXED
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

/*
    ===========================
    2. POST ORDER
    ===========================
*/
app.post("/orders", async (req, res) => {
    try {
        const order = req.body;

        const result = await ordersCollection.insertOne(order);

        res.json({
            message: "Order created successfully",
            orderId: result.insertedId
        });

    } catch (err) {
        res.status(500).json({ error: "Failed to create order" });
    }
});

/*
    ===========================
    3. PUT UPDATE LESSON
    ===========================
*/
app.put("/lessons/:id", async (req, res) => {
    try {
        const id = req.params.id.trim(); // safety trim
        const updates = req.body;

        // Validate correct MongoDB ID
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid lesson ID" });
        }

        const result = await lessonsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Lesson not found" });
        }

        res.json({ message: "Lesson updated successfully" });

    } catch (err) {
        console.error("PUT error:", err);
        res.status(500).json({ error: "Failed to update lesson" });
    }
});

/*
    ===========================
    DEFAULT ROUTE
    ===========================
*/
app.get("/", (req, res) => {
    res.send("Coursework API is running ✔");
});
