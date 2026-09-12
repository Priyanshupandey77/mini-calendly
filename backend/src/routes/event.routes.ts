import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createEventController,
  deleteEventController,
  getEventsController,
} from "../controllers/event.controller";

const router = Router();

router.post("/", authMiddleware, createEventController);
router.get("/", authMiddleware, getEventsController);
router.delete("/:id", authMiddleware, deleteEventController);

export default router;
