"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.createEventSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createEventSchema = zod_1.default.object({
    title: zod_1.default.string().min(2).max(100),
    description: zod_1.default.string().max(500).optional(),
    slug: zod_1.default
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    duration: zod_1.default.number().int().min(15).max(120),
});
exports.updateEventSchema = zod_1.default.object({
    title: zod_1.default.string().min(2).max(100),
    description: zod_1.default.string().max(500).optional(),
    slug: zod_1.default
        .string()
        .min(2)
        .max(100)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    duration: zod_1.default.number().int().min(15).max(120),
});
