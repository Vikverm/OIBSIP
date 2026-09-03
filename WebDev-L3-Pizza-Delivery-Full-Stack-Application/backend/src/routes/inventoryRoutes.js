import { Router } from "express";
import * as c from "../controllers/inventoryController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const r = Router();

// Get all ingredients
r.get("/", protect, c.listInventory);

// Get single ingredient
r.get("/:id", protect, c.getInventoryById);

// Create ingredient - Admin only
r.post("/", protect, adminOnly, c.createInventory);

// Update ingredient - Admin only
r.put("/:id", protect, adminOnly, c.updateInventory);

// Delete ingredient - Admin only
r.delete("/:id", protect, adminOnly, c.deleteInventory);

export default r;