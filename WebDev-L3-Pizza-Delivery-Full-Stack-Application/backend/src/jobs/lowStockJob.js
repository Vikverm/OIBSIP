import cron from "node-cron";
import Inventory from "../models/Inventory.js";
import { sendMail } from "../utils/email.js";

const checkLowStock = async () => {
  try {
    if (!process.env.ADMIN_EMAIL) return;
    const items = await Inventory.find();
    const low = items.filter(i => i.stock <= i.lowStockThreshold && !i.lowStockAlertSent);
    if (!low.length) {
      await Inventory.updateMany({ stock: { $gt: 0 }, lowStockAlertSent: true, $expr: { $gt: ["$stock", "$lowStockThreshold"] } }, { $set: { lowStockAlertSent: false } });
      return;
    }
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `PizzaFlow Low Stock Alert (${low.length} item${low.length > 1 ? "s" : ""})`,
      html: `<h2>⚠️ Low Stock Alert</h2><p>The following items are below their configured threshold:</p><ul>${low.map(i => `<li><strong>${i.name}</strong> — ${i.stock} ${i.unit} (alert at ${i.lowStockThreshold})</li>`).join("")}</ul>`,
    });
    await Inventory.updateMany({ _id: { $in: low.map(i => i._id) } }, { $set: { lowStockAlertSent: true } });
  } catch (error) { console.error("Low-stock job error:", error.message); }
};

export const startLowStockJob = () => {
  cron.schedule("*/5 * * * *", checkLowStock);
  checkLowStock();
  console.log("Low-stock monitoring job started (every 5 minutes)");
};
