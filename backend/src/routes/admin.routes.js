import express from "express";

import {
  getAdminStats,
  getAllUsers,
  getAllBookings,
} from "../controllers/admin.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);

export default router;