import { Router } from "express";
import * as c from "../controllers/orderController.js";
import * as analytics from "../controllers/analyticsController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const r = Router();
r.get("/mine", protect, c.myOrders);
r.get("/analytics", protect, adminOnly, analytics.getAnalytics);
r.get("/", protect, adminOnly, c.allOrders);
r.post("/", protect, c.createOrder);
r.patch("/:id/status", protect, adminOnly, c.updateStatus);
export default r;
