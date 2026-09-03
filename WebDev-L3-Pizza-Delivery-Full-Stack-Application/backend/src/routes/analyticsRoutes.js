import { Router } from "express";

import { getAnalytics } from "../controllers/analyticsController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, adminOnly, getAnalytics);

export default router;