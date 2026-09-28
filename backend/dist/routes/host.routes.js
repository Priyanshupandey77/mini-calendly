"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const host_controller_1 = require("../controllers/host.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, host_controller_1.getHostBookingsController);
exports.default = router;
