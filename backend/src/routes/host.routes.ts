import { Router } from "express";
import { getHostBookingsController } from "../controllers/host.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/",authMiddleware, getHostBookingsController);

export default router;
