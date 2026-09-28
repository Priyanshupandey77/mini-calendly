"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.existingAvailability = existingAvailability;
exports.createAvailability = createAvailability;
exports.getAvailability = getAvailability;
exports.updateAvailability = updateAvailability;
exports.deleteAvailability = deleteAvailability;
const AppError_1 = require("../errors/AppError");
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
        throw new AppError_1.AppError("Start time must be before end time", 400);
    }
    const existingSlots = await existingAvailability(dayOfWeek, userId);
    for (const existing of existingSlots) {
        const existingStart = timeToMinutes(existing.startTime);
        const existingEnd = timeToMinutes(existing.endTime);
        if (startMinutes < existingEnd && endMinutes > existingStart) {
            throw new AppError_1.AppError("Availability overlaps with an existing slot", 409);
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
// GET
async function getAvailability(userId) {
    const availability = await prisma_1.default.availability.findMany({
        where: {
            userId,
        },
        orderBy: {
            dayOfWeek: "asc",
        },
    });
    return availability;
}
// UPDATE
async function updateAvailability(availabilityId, dayOfWeek, startTime, endTime, userId) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    if (startMinutes >= endMinutes) {
        throw new AppError_1.AppError("Start time must be before end time", 400);
    }
    const existing = await prisma_1.default.availability.findFirst({
        where: {
            id: availabilityId,
            userId,
        },
    });
    if (!existing) {
        throw new AppError_1.AppError("Availability not found", 404);
    }
    const existingSlots = await prisma_1.default.availability.findMany({
        where: {
            userId,
            dayOfWeek,
            id: {
                not: availabilityId,
            },
        },
    });
    for (const existing of existingSlots) {
        const existingStart = timeToMinutes(existing.startTime);
        const existingEnd = timeToMinutes(existing.endTime);
        if (startMinutes < existingEnd && endMinutes > existingStart) {
            throw new AppError_1.AppError("Availability overlaps with an existing slot", 409);
        }
    }
    const updatedAvailability = await prisma_1.default.availability.update({
        where: {
            id: availabilityId,
        },
        data: {
            dayOfWeek,
            startTime,
            endTime,
        },
    });
    return updatedAvailability;
}
// DELETE
async function deleteAvailability(availabilityId, userId) {
    const existing = await prisma_1.default.availability.findFirst({
        where: {
            id: availabilityId,
            userId,
        },
    });
    if (!existing) {
        throw new AppError_1.AppError("Availability not found", 404);
    }
    await prisma_1.default.availability.delete({
        where: {
            id: availabilityId,
        },
    });
}
