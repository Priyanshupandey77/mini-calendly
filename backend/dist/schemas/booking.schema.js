"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestCancelBookingSchema = exports.createBookingSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBookingSchema = zod_1.default.object({
    eventId: zod_1.default.number().int().positive(),
    date: zod_1.default.string().date(),
    startTime: zod_1.default.string().regex(/^\d{2}:\d{2}$/),
    guestName: zod_1.default.string().trim().min(2),
    guestEmail: zod_1.default.string().trim().email(),
});
exports.guestCancelBookingSchema = zod_1.default.object({
    guestEmail: zod_1.default.string().email(),
});
