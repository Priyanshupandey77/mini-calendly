import { Request, Response, NextFunction } from "express";
import Jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    const decoded = Jwt.verify(token, secret);
    if (typeof decoded === "string" || typeof decoded.userId !== "number") {
      return res.status(401).json({
        msg: "Unauthorized request",
      });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorized request" });
  }
}
