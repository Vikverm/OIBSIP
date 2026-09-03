import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/Order.js";
import { protect } from "../middleware/auth.js";
import { consumeInventory } from "../utils/inventory.js";

const router = express.Router();
const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

const confirmPaidOrder = async (order) => {
  if (order.inventoryConsumed) return order;
  await consumeInventory(order.pizza);
  order.inventoryConsumed = true;
  order.paymentStatus = "paid";
  order.status = "Order Received";
  return order;
};

router.post("/:orderId/create", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id.toString()) return res.status(403).json({ message: "Unauthorized" });
    if (order.paymentStatus === "paid") return res.status(400).json({ message: "This order is already paid" });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(Number(order.total) * 100), currency: "INR", receipt: order._id.toString(),
    });
    order.paymentStatus = "created";
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();
    res.json({ key: process.env.RAZORPAY_KEY_ID, razorpayOrder });
  } catch (error) {
    console.error("Razorpay create error:", error);
    res.status(500).json({ message: error.message || "Unable to create Razorpay payment" });
  }
});

router.post("/verify", protect, async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id.toString()) return res.status(403).json({ message: "Unauthorized" });
    if (order.paymentStatus === "paid") return res.json({ success: true, message: "Payment already verified", order });
    if (order.razorpayOrderId !== razorpay_order_id) return res.status(400).json({ message: "Invalid Razorpay order" });

    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (expected !== razorpay_signature) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    await confirmPaidOrder(order);
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();
    res.json({ success: true, message: "Payment verified and order confirmed", order });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: error.message || "Payment verification failed" });
  }
});

// Safe local/test-mode simulation. Keep disabled in production unless explicitly enabled.
router.post("/test-success", protect, async (req, res) => {
  if (process.env.ENABLE_TEST_PAYMENT !== "true") return res.status(404).json({ message: "Test payment is disabled" });
  try {
    const order = await Order.findById(req.body.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id.toString()) return res.status(403).json({ message: "Unauthorized" });
    if (order.paymentStatus === "paid") return res.json({ success: true, order });
    await confirmPaidOrder(order);
    order.razorpayPaymentId = `test_pay_${Date.now()}`;
    order.razorpaySignature = "test-mode";
    await order.save();
    res.json({ success: true, message: "Test payment successful", order });
  } catch (error) {
    res.status(400).json({ message: error.message || "Test payment failed" });
  }
});

export default router;
