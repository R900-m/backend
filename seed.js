

import dotenv from "dotenv";
import mongoose from "mongoose";
import Lesson from "./models/Lesson.js";

// Load the .env configuration
dotenv.config();

// Define your lessons data (like your products)
const data = [
  { topic: "Art",        location: "Golders Green", price: 85,  space: 5, image: "/images/art.jpg" },
  { topic: "Coding",     location: "Barnet",        price: 120, space: 5, image: "/images/coding.jpg" },
  { topic: "Dance",      location: "Mill Hill",     price: 75,  space: 5, image: "/images/Dance.jpg" },
  { topic: "Drama",      location: "Camden",        price: 80,  space: 5, image: "/images/Drama.jpg" },
  { topic: "English",    location: "Colindale",     price: 90,  space: 5, image: "/images/english.jpg" },
  { topic: "Math",       location: "Hendon",        price: 100, space: 5, image: "/images/math.jpg" },
  { topic: "Music",      location: "Finchley",      price: 95,  space: 5, image: "/images/music.jpg" },
  { topic: "Photography",location: "Hampstead",     price: 105, space: 5, image: "/images/photography.jpg" },
  { topic: "Robotics",   location: "Cricklewood",   price: 130, space: 5, image: "/images/robotics.jpg" },
  { topic: "Science",    location: "Brent",         price: 110, space: 5, image: "/images/science.jpg" }
];

// Connect to MongoDB and insert lessons
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "after_school_activities" });
    console.log("Connected to MongoDB ✅");

    // Remove any old lessons first
    await Lesson.deleteMany({});
    console.log("Old lessons cleared.");

    // Insert new lessons
    const docs = await Lesson.insertMany(data);
    console.log(`✅ Inserted ${docs.length} lessons successfully.`);

    process.exit(0); // Close the script when done
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
});

