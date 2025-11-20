import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const lessons = [
  { topic: "Art", location: "Golders Green", price: 85, space: 5, image: "/images/art.jpg" },
  { topic: "Coding", location: "Barnet", price: 120, space: 5, image: "/images/coding.jpg" },
  { topic: "Dance", location: "Mill Hill", price: 75, space: 5, image: "/images/dance.jpg" },
  { topic: "Drama", location: "Camden", price: 80, space: 5, image: "/images/drama.jpg" },
  { topic: "English", location: "Colindale", price: 90, space: 5, image: "/images/english.jpg" },
  { topic: "Math", location: "Hendon", price: 100, space: 5, image: "/images/math.jpg" },
  { topic: "Music", location: "Finchley", price: 95, space: 5, image: "/images/music.jpg" },
  { topic: "Photography", location: "Hampstead", price: 105, space: 5, image: "/images/photography.jpg" },
  { topic: "Robotics", location: "Cricklewood", price: 130, space: 5, image: "/images/robotics.jpg" },
  { topic: "Science", location: "Brent", price: 110, space: 5, image: "/images/science.jpg" }
];

async function seedDatabase() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const db = client.db("after_school_activities");
    const lessonsCollection = db.collection("lessons");

    await lessonsCollection.deleteMany({});
    console.log("Old lessons removed.");

    const result = await lessonsCollection.insertMany(lessons);
    console.log(`Inserted ${result.insertedCount} lessons successfully.`);

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedDatabase();
