import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["base", "sauce", "cheese", "vegetable"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      default: "units",
    },

    lowStockThreshold: {
      type: Number,
      default: 20,
      min: 0,
    },

    // Prevent repeated alerts for the same item
    lowStockAlertSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Inventory", schema);