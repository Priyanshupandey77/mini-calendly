"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeController = getMeController;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function getMeController(req, res) {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: req.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });
    if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
    }
    return res.status(200).json(user);
}
