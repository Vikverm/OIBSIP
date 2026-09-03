import Inventory from "../models/Inventory.js";

export const listInventory = async (req, res) => {
  try { res.json(await Inventory.find().sort({ category: 1, name: 1 })); }
  catch { res.status(500).json({ message: "Unable to fetch inventory" }); }
};

export const getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    res.json(item);
  } catch { res.status(500).json({ message: "Unable to fetch inventory item" }); }
};

export const createInventory = async (req, res) => {
  try {
    const { name, category, price = 0, stock = 0, unit = "units", lowStockThreshold = 20 } = req.body;
    if (!name?.trim() || !category) return res.status(400).json({ message: "Name and category are required" });
    const item = await Inventory.create({ name: name.trim(), category, price: Number(price), stock: Number(stock), unit, lowStockThreshold: Number(lowStockThreshold) });
    res.status(201).json({ message: "Inventory item created successfully", item });
  } catch (error) { res.status(400).json({ message: error.message || "Unable to create inventory item" }); }
};

export const updateInventory = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    const oldStock = item.stock;
    const fields = ["name", "category", "unit"];
    fields.forEach(f => { if (req.body[f] !== undefined) item[f] = f === "name" ? req.body[f].trim() : req.body[f]; });
    if (req.body.price !== undefined) item.price = Number(req.body.price);
    if (req.body.stock !== undefined) item.stock = Number(req.body.stock);
    if (req.body.lowStockThreshold !== undefined) item.lowStockThreshold = Number(req.body.lowStockThreshold);
    if (item.stock > item.lowStockThreshold || item.stock > oldStock) item.lowStockAlertSent = false;
    await item.save();
    res.json({ message: "Inventory updated successfully", item });
  } catch (error) { res.status(400).json({ message: error.message || "Unable to update inventory" }); }
};

export const deleteInventory = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Inventory item not found" });
    res.json({ message: "Inventory item deleted successfully" });
  } catch { res.status(500).json({ message: "Unable to delete inventory item" }); }
};
