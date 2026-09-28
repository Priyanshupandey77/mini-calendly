"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostBookings = getHostBookings;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function getHostBookings(userId) {
    const bookings = await prisma_1.default.booking.findMany({
        where: {
            userId,
        },
        include: {
            event: true,
        },
    });
    return bookings;
}
