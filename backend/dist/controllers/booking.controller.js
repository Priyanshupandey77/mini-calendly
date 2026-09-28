"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingController = createBookingController;
exports.cancelBookingController = cancelBookingController;
exports.guestCancelBookingController = guestCancelBookingController;
const booking_schema_1 = require("../schemas/booking.schema");
const booking_service_1 = require("../services/booking.service");
async function createBookingController(req, res, next) {
    const result = booking_schema_1.createBookingSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid Input",
            errors: result.error,
        });
    }
    const { eventId, date, startTime, guestName, guestEmail } = result.data;
    const bookingDate = new Date(date);
    try {
        const booking = await (0, booking_service_1.createBooking)(eventId, guestName, guestEmail, bookingDate, startTime);
        return res.status(201).json({
            msg: "slot booked successfully",
            booking,
        });
    }
    catch (error) {
        next(error);
    }
}
async function cancelBookingController(req, res, next) {
    const userId = req.userId;
    const bookingId = Number(req.params.id);
    if (!userId) {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }
    if (Number.isNaN(bookingId)) {
        return res.status(400).json({
            msg: "Invalid booking ID",
        });
    }
    try {
        const cancelledBooking = await (0, booking_service_1.cancelBooking)(bookingId, userId);
        return res.status(200).json({
            msg: "Booking cancelled successfully",
            cancelledBooking,
        });
    }
    catch (error) {
        next(error);
    }
}
async function guestCancelBookingController(req, res, next) {
    const bookingId = Number(req.params.id);
    if (Number.isNaN(bookingId)) {
        return res.status(400).json({
            msg: "Invalid booking ID",
        });
    }
    const result = booking_schema_1.guestCancelBookingSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            msg: "Invalid input",
            errors: result.error,
        });
    }
    const { guestEmail } = result.data;
    try {
        const cancelledBooking = await (0, booking_service_1.cancelBookingByGuest)(bookingId, guestEmail);
        return res.status(200).json({
            msg: "Booking cancelled successfully",
            cancelledBooking,
        });
    }
    catch (error) {
        next(error);
    }
}
