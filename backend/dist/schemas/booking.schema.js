"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createBookingSchema = zod_1.default.object({
    eventId: zod_1.default.number().int(),
    date: zod_1.default.string(),
    startTime: zod_1.default.string(),
    guestName: zod_1.default.string(),
    guestEmail: zod_1.default.string().email(),
});
