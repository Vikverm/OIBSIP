import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    pizza: {
      base: { type: String, required: true },
      sauce: { type: String, required: true },
      cheese: { type: String, required: true },
      vegetables: { type: [String], default: [] },
      price: { type: Number, required: true, min: 0 },
    },
    total: { type: Number, required: true, min: 0 },
    address: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Order Received", "Preparing", "Out for Delivery", "Delivered"],
      default: "Order Received",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "created", "paid", "failed", "expired"],
      default: "pending",
      index: true,
    },
    inventoryConsumed: { type: Boolean, default: false },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
