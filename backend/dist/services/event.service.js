"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.deleteEvent = deleteEvent;
const AppError_1 = require("../errors/AppError");
const prisma_1 = __importDefault(require("../lib/prisma"));
async function createEvent(title, description, slug, duration, userId) {
    const event = await prisma_1.default.event.create({
        data: {
            title,
            description: description ?? null,
            slug,
            duration,
            userId,
        },
    });
    return event;
}
async function getEvents(userId) {
    const events = await prisma_1.default.event.findMany({
        where: {
            userId,
        },
    });
    return events;
}
async function deleteEvent(userId, eventId) {
    const result = await prisma_1.default.event.deleteMany({
        where: {
            id: eventId,
            userId,
        },
    });
    if (result.count === 0) {
        throw new AppError_1.AppError("Event not found", 404);
    }
    return result;
}
