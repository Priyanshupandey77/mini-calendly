"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.availabilitySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.availabilitySchema = zod_1.default.object({
    dayOfWeek: zod_1.default.number().int().min(1).max(7),
    startTime: zod_1.default.string().regex(/^\d{2}:\d{2}$/),
    endTime: zod_1.default.string().regex(/^\d{2}:\d{2}$/),
});
