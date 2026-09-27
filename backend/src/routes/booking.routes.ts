import { Router } from "express";
import {
  cancelBookingController,
  createBookingController,
  guestCancelBookingController,
} from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createBookingController);
router.post("/:id/cancel", guestCancelBookingController);
router.delete("/:id", authMiddleware, cancelBookingController);

export default router;
