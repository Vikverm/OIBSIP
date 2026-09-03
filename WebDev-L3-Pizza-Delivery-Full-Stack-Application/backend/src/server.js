import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { connectDB } from "./config/db.js";
import { seed } from "./utils/seed.js";
import Order from "./models/Order.js";
import auth from "./routes/authRoutes.js";
import inventory from "./routes/inventoryRoutes.js";
import orders from "./routes/orderRoutes.js";
import payments from "./routes/paymentRoutes.js";
import { startLowStockJob } from "./jobs/lowStockJob.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(x => x.trim()) : true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => res.json({ ok: true, message: "PizzaFlow API is running" }));
app.use("/api/auth", auth);
app.use("/api/inventory", inventory);
app.use("/api/orders", orders);
app.use("/api/payments", payments);

// Expire abandoned unpaid orders every 5 minutes.
cron.schedule("*/5 * * * *", async () => {
  try {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    const result = await Order.updateMany({ paymentStatus: { $in: ["pending", "created"] }, createdAt: { $lt: cutoff } }, { $set: { paymentStatus: "expired" } });
    if (result.modifiedCount) console.log(`${result.modifiedCount} unpaid orders expired`);
  } catch (error) { console.error("Order expiry cleanup error:", error.message); }
});

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seed();
  startLowStockJob();
  app.listen(PORT, () => console.log(`PizzaFlow API running on port ${PORT}`));
}).catch(error => { console.error("Database connection error:", error); process.exit(1); });
