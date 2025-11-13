import mongoose from "mongoose";

// ----- Order Item (one line in the cart) -----
const OrderItemSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  spaces: {
    type: Number,
    required: true,
    min: 1
  }
});

// ----- Full Order -----
const OrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
