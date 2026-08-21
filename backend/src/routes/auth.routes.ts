import { Router } from "express";
import { loginController, signupController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { getMeController } from "../controllers/user.controller";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/me", authMiddleware, getMeController);


export default router;
