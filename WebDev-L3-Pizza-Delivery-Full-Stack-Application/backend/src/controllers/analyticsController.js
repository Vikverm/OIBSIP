import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";

export const getAnalytics = async (req, res) => {
  try {
    const [orders, inventory] = await Promise.all([
      Order.find().sort({ createdAt: 1 }),
      Inventory.find(),
    ]);

    const paid = orders.filter(o => o.paymentStatus === "paid");
    const totalRevenue = paid.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    const todayRevenue = paid.filter(o => o.createdAt >= today && o.createdAt < tomorrow)
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    const revenueData = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date(); start.setHours(0, 0, 0, 0); start.setDate(start.getDate() - i);
      const end = new Date(start); end.setDate(end.getDate() + 1);
      revenueData.push({
        date: start.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
        revenue: paid.filter(o => o.createdAt >= start && o.createdAt < end)
          .reduce((sum, o) => sum + Number(o.total || 0), 0),
      });
    }

    const count = status => orders.filter(o => o.status === status).length;
    const lowStock = inventory.filter(i => i.stock <= i.lowStockThreshold);

    res.json({
      totalOrders: orders.length,
      paidOrders: paid.length,
      pendingOrders: orders.filter(o => ["pending", "created"].includes(o.paymentStatus)).length,
      failedPayments: orders.filter(o => ["failed", "expired"].includes(o.paymentStatus)).length,
      delivered: count("Delivered"),
      totalRevenue,
      todayRevenue,
      inventoryItems: inventory.length,
      lowStockItems: lowStock.length,
      revenueData,
      statusData: [
        { name: "Received", value: count("Order Received") },
        { name: "Preparing", value: count("Preparing") },
        { name: "Delivery", value: count("Out for Delivery") },
        { name: "Delivered", value: count("Delivered") },
      ].filter(x => x.value),
      paymentData: [
        { name: "Paid", value: paid.length },
        { name: "Pending", value: orders.filter(o => ["pending", "created"].includes(o.paymentStatus)).length },
        { name: "Failed", value: orders.filter(o => ["failed", "expired"].includes(o.paymentStatus)).length },
      ].filter(x => x.value),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Unable to load analytics" });
  }
};
