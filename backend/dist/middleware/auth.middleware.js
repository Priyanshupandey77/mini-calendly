"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ msg: "Unauthorized request" });
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ msg: "Unauthorized request" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (typeof decoded === "string" || typeof decoded.userId !== "number") {
            return res.status(401).json({
                msg: "Unauthorized request",
            });
        }
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ msg: "Unauthorized request" });
    }
}
