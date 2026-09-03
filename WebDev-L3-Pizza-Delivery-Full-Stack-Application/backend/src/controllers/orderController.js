import Order from "../models/Order.js";
import { checkInventory } from "../utils/inventory.js";

const validStatuses = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

export const createOrder = async (req, res) => {
  try {
    const { pizza, total, address } = req.body;
    if (!pizza?.base || !pizza?.sauce || !pizza?.cheese || !address?.trim()) {
      return res.status(400).json({ message: "Pizza selections and delivery address are required." });
    }

    await checkInventory(pizza);

    const order = await Order.create({
      user: req.user.id,
      pizza,
      total: Number(total),
      address: address.trim(),
      paymentStatus: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(400).json({ message: error.message || "Unable to create order." });
  }
};

export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Unable to load orders." });
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Unable to load orders." });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid order status." });

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Unable to update order status." });
  }
};
