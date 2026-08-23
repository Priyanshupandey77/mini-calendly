import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createEventController } from "../controllers/event.controller";

const router = Router();

router.post("/", authMiddleware, createEventController);

export default router;
