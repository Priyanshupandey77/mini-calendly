"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingController = createBookingController;
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
