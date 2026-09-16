import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {
  createAvailabilityController,
  getAvailabilityController,
  updateAvailabilityController,
  deleteAvailabilityController,
} from "../controllers/availability.controller";

const router = Router();

router.post("/", authMiddleware, createAvailabilityController);

router.get("/", authMiddleware, getAvailabilityController);

router.put("/:id", authMiddleware, updateAvailabilityController);

router.delete("/:id", authMiddleware, deleteAvailabilityController);

export default router;
