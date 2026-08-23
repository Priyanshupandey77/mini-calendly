import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createAvailabilityController } from "../controllers/availability.controller";

const router = Router();

router.post("/", authMiddleware, createAvailabilityController);

export default router;
