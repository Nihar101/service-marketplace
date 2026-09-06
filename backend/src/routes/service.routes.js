import express from "express";

import {
  createService,
  getServices,
  getServiceById,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.post("/", createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.delete("/:id", deleteService);

export default router;