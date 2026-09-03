import Inventory from "../models/Inventory.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const seed = async () => {
  const items = [
    ["Classic Hand Tossed", "base", 99, 50], ["Thin Crust", "base", 119, 50], ["Cheese Burst", "base", 149, 30], ["Whole Wheat", "base", 109, 30], ["Gluten Free", "base", 159, 20],
    ["Tomato", "sauce", 25, 100], ["Marinara", "sauce", 30, 60], ["Pesto", "sauce", 35, 50], ["BBQ", "sauce", 30, 50], ["Alfredo", "sauce", 35, 50],
    ["Mozzarella", "cheese", 55, 100], ["Cheddar", "cheese", 60, 70], ["Parmesan", "cheese", 65, 50],
    ["Paneer", "vegetable", 45, 80], ["Onion", "vegetable", 20, 100], ["Capsicum", "vegetable", 20, 100], ["Corn", "vegetable", 25, 100], ["Olives", "vegetable", 30, 70],
  ];
  for (const [name, category, price, stock] of items) {
    await Inventory.updateOne({ name }, { $set: { category, price }, $setOnInsert: { name, stock, unit: "units", lowStockThreshold: 20 } }, { upsert: true });
  }
  const adminEmail = (process.env.ADMIN_SEED_EMAIL || "admin@pizza.com").toLowerCase();
  if (!await User.findOne({ email: adminEmail })) {
    await User.create({ name: "Pizza Admin", email: adminEmail, password: await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || "Admin@123", 10), role: "admin", isVerified: true });
  }
};
