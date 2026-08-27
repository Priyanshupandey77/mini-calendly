import { NextFunction, Request, Response } from "express";
import { createBookingSchema } from "../schemas/booking.schema";
import { createBooking } from "../services/booking.service";

export async function createBookingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createBookingSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid Input",
      errors: result.error,
    });
  }
  const { eventId, date, startTime, guestName, guestEmail } = result.data;
  const bookingDate = new Date(date);

  try {
    const booking = await createBooking(
      eventId,
      guestName,
      guestEmail,
      bookingDate,
      startTime,
    );

    return res.status(201).json({
      msg: "slot booked successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
}
