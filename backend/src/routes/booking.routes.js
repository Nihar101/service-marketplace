import express from "express";

import {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("customer"),
  createBooking
);

router.get(
  "/my",
  protect,
  authorize("customer"),
  getMyBookings
);

router.get(
  "/provider",
  protect,
  authorize("provider"),
  getProviderBookings
);

router.patch(
  "/:id/status",
  protect,
  authorize("provider"),
  updateBookingStatus
);

export default router;