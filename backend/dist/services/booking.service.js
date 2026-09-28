"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBooking = createBooking;
exports.cancelBooking = cancelBooking;
exports.cancelBookingByGuest = cancelBookingByGuest;
const AppError_1 = require("../errors/AppError");
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
function timeToMinutes(time) {
    const splitTime = time.split(":");
    const hours = Number(splitTime[0]);
    const minutes = Number(splitTime[1]);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes;
}
function addMinutes(time, duration) {
    const totalMinutes = timeToMinutes(time);
    const totalTime = totalMinutes + duration;
    const convertedHours = Math.floor(totalTime / 60);
    const convertedMinutes = totalTime % 60;
    return `${String(convertedHours).padStart(2, "0")}:${String(convertedMinutes).padStart(2, "0")}`;
}
async function createBooking(eventId, guestName, guestEmail, date, startTime) {
    const event = await prisma_1.default.event.findUnique({
        where: {
            id: eventId,
        },
    });
    if (!event) {
        throw new AppError_1.AppError("Event does not exist", 404);
    }
    const endTime = addMinutes(startTime, event.duration);
    const jsDay = date.getDay();
    const dayOfWeek = ((jsDay + 6) % 7) + 1;
    const availability = await prisma_1.default.availability.findMany({
        where: {
            userId: event.userId,
            dayOfWeek,
        },
    });
    const bookingStart = timeToMinutes(startTime);
    const bookingEnd = timeToMinutes(endTime);
    let isWithinAvailability = false;
    for (const existing of availability) {
        const availabilityStart = timeToMinutes(existing.startTime);
        const availabilityEnd = timeToMinutes(existing.endTime);
        if (bookingStart >= availabilityStart && bookingEnd <= availabilityEnd) {
            isWithinAvailability = true;
            break;
        }
    }
    if (!isWithinAvailability) {
        throw new AppError_1.AppError("Booking time is outside host availability", 400);
    }
    const [hours, minutes] = startTime.split(":").map(Number);
    date.setHours(hours, minutes);
    if (date.getTime() < Date.now()) {
        throw new AppError_1.AppError("Booking time is in the past", 400);
    }
    const booking = await prisma_1.default.$transaction(async (tx) => {
        // database operations
        const existingBookings = await tx.booking.findMany({
            where: {
                userId: event.userId,
                date,
                status: client_1.BookingStatus.CONFIRMED,
            },
        });
        for (const existing of existingBookings) {
            const existingStart = timeToMinutes(existing.startTime);
            const existingEnd = timeToMinutes(existing.endTime);
            if (bookingStart < existingEnd && bookingEnd > existingStart) {
                throw new AppError_1.AppError("Booking overlaps with an existing slot", 409);
            }
        }
        return tx.booking.create({
            data: {
                guestName,
                guestEmail,
                date,
                startTime,
                endTime,
                userId: event.userId,
                eventId,
            },
        });
    });
    return booking;
}
async function cancelBooking(bookingId, userId) {
    const booking = await prisma_1.default.booking.findFirst({
        where: {
            id: bookingId,
            userId,
        },
    });
    if (!booking) {
        throw new AppError_1.AppError("Booking not found", 404);
    }
    if (booking.status === client_1.BookingStatus.CANCELLED) {
        throw new AppError_1.AppError("Booking is already cancelled", 409);
    }
    const cancelledBooking = await prisma_1.default.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: client_1.BookingStatus.CANCELLED,
        },
    });
    return cancelledBooking;
}
async function cancelBookingByGuest(bookingId, guestEmail) {
    const booking = await prisma_1.default.booking.findFirst({
        where: {
            id: bookingId,
            guestEmail,
        },
    });
    if (!booking) {
        throw new AppError_1.AppError("Booking not found", 404);
    }
    if (booking.status === client_1.BookingStatus.CANCELLED) {
        throw new AppError_1.AppError("Booking is already cancelled", 409);
    }
    const cancelledBooking = await prisma_1.default.booking.update({
        where: {
            id: bookingId,
        },
        data: {
            status: client_1.BookingStatus.CANCELLED,
        },
    });
    return cancelledBooking;
}
