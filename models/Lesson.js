import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 1
    },
    space: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", LessonSchema);

