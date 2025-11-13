import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson" },
  spaces: Number
});

const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  items: [OrderItemSchema]
});

export default mongoose.model("Order", OrderSchema);
