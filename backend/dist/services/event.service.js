"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvailableSlots = getAvailableSlots;
exports.createEvent = createEvent;
exports.getEvents = getEvents;
exports.getPublicEvent = getPublicEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
const client_1 = require("@prisma/client");
const AppError_1 = require("../errors/AppError");
const prisma_1 = __importDefault(require("../lib/prisma"));
function timeToMinutes(time) {
    const splitedTime = time.split(":");
    const hours = Number(splitedTime[0]);
    const minutes = Number(splitedTime[1]);
    const totalTime = hours * 60 + minutes;
    return totalTime;
}
function generateTimeSlots(startTime, endTime, duration) {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const slots = [];
    let current = startMinutes;
    while (current + duration <= endMinutes) {
        const hours = Math.floor(current / 60);
        const minutes = current % 60;
        const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        slots.push(time);
        current += duration;
    }
    return slots;
}
function isSlotBooked(slotStart, duration, bookings) {
    const slotStartMinutes = timeToMinutes(slotStart);
    const slotEndMinutes = slotStartMinutes + duration;
    for (const booking of bookings) {
        const bookingStartMinutes = timeToMinutes(booking.startTime);
        const bookingEndMinutes = timeToMinutes(booking.endTime);
        if (slotStartMinutes < bookingEndMinutes &&
            slotEndMinutes > bookingStartMinutes) {
            return true;
        }
    }
    return false;
}
function getDayOfWeek(date) {
    const dayOfWeek = ((date.getDay() + 6) % 7) + 1;
    return dayOfWeek;
}
async function getAvailableSlots(slug, dateString) {
    const event = await prisma_1.default.event.findUnique({
        where: {
            slug,
        },
    });
    if (!event) {
        throw new AppError_1.AppError("Event not found", 404);
    }
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        throw new AppError_1.AppError("Invalid date", 400);
    }
    const dayOfWeek = getDayOfWeek(date);
    const availability = await prisma_1.default.availability.findMany({
        where: {
            userId: event.userId,
            dayOfWeek,
        },
    });
    if (availability.length === 0) {
        return [];
    }
    const slots = [];
    for (const slot of availability) {
        const generatedSlots = generateTimeSlots(slot.startTime, slot.endTime, event.duration);
        slots.push(...generatedSlots);
    }
    const bookings = await prisma_1.default.booking.findMany({
        where: {
            eventId: event.id,
            date,
            status: client_1.BookingStatus.CONFIRMED,
        },
    });
    const availableSlots = slots.filter((slot) => {
        return !isSlotBooked(slot, event.duration, bookings);
    });
    return availableSlots;
}
async function createEvent(title, description, slug, duration, userId) {
    try {
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
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw new AppError_1.AppError("An event with this slug already exists", 409);
        }
        throw error;
    }
}
async function getEvents(userId) {
    const events = await prisma_1.default.event.findMany({
        where: {
            userId,
        },
    });
    return events;
}
async function getPublicEvent(slug) {
    const event = await prisma_1.default.event.findUnique({
        where: {
            slug,
        },
    });
    if (!event) {
        throw new AppError_1.AppError("Event not found", 404);
    }
    return event;
}
async function updateEvent(eventId, userId, title, description, slug, duration) {
    const event = await prisma_1.default.event.findFirst({
        where: {
            id: eventId,
            userId,
        },
    });
    if (!event) {
        throw new AppError_1.AppError("Event not found", 404);
    }
    try {
        const updatedEvent = await prisma_1.default.event.update({
            where: {
                id: eventId,
            },
            data: {
                title,
                description: description ?? null,
                slug,
                duration,
            },
        });
        return updatedEvent;
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002") {
            throw new AppError_1.AppError("An event with this slug already exists", 409);
        }
        throw error;
    }
}
async function deleteEvent(userId, eventId) {
    const check = await prisma_1.default.event.findUnique({
        where: {
            id: eventId,
            userId,
        },
        include: {
            bookings: {
                where: {
                    status: client_1.BookingStatus.CONFIRMED,
                },
                select: {
                    id: true,
                },
            },
        },
    });
    if (check === null) {
        throw new AppError_1.AppError("Event not found", 404);
    }
    if (check.bookings.length > 0) {
        throw new AppError_1.AppError("Event has bookings", 409);
    }
    const result = await prisma_1.default.$transaction(async (tx) => {
        await tx.booking.deleteMany({
            where: {
                eventId,
                status: client_1.BookingStatus.CANCELLED,
            },
        });
        const result = await tx.event.deleteMany({
            where: {
                id: eventId,
                userId,
            },
        });
        return result;
    });
    return result;
}
