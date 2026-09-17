import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  createEventController,
  deleteEventController,
  getAvailableSlotsController,
  getEventsController,
  getPublicEventController,
} from "../controllers/event.controller";

const router = Router();

router.post("/", authMiddleware, createEventController);
router.get("/", authMiddleware, getEventsController);
router.get(
  "/public/:slug/availability",
  getAvailableSlotsController,
);
router.get("/public/:slug", getPublicEventController);
router.delete("/:id", authMiddleware, deleteEventController);

export default router;
