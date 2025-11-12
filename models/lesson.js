import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  topic: String,
  location: String,
  price: Number,
  space: Number,
  image: String
});

export default mongoose.model("Lesson", LessonSchema);
