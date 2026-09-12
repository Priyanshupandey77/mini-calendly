"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existingAvailability = existingAvailability;
exports.createAvailability = createAvailability;
const prisma_1 = __importDefault(require("../lib/prisma"));
function timeToMinutes(time) {
    const splitedTime = time.split(":");
    const hours = Number(splitedTime[0]);
    const minutes = Number(splitedTime[1]);
    const totalTime = hours * 60 + minutes;
    return totalTime;
}
async function existingAvailability(dayOfWeek, userId) {
    const existingAvailability = await prisma_1.default.availability.findMany({
        where: {
            userId,
            dayOfWeek,
        },
    });
    return existingAvailability;
}
async function createAvailability(dayOfWeek, startTime, endTime, userId) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    if (startMinutes >= endMinutes) {
        throw new Error("Start time must be before end time");
    }
    const existingSlots = await existingAvailability(dayOfWeek, userId);
    for (const existing of existingSlots) {
        // convert existing.startTime
        const existingStart = timeToMinutes(existing.startTime);
        // convert existing.endTime
        const existingEnd = timeToMinutes(existing.endTime);
        // check overlap
        if (startMinutes < existingEnd && endMinutes > existingStart) {
            throw new Error("Availability overlaps with an existing slot");
        }
    }
    const availability = await prisma_1.default.availability.create({
        data: {
            dayOfWeek,
            startTime,
            endTime,
            userId,
        },
    });
    return availability;
}
