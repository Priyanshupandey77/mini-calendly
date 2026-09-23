import { Router } from "express";
import {
  cancelBookingController,
  createBookingController,
} from "../controllers/booking.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createBookingController);
router.delete("/:id", authMiddleware, cancelBookingController);

export default router;
