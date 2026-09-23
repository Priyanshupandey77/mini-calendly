import { NextFunction, Request, Response } from "express";
import { createBookingSchema } from "../schemas/booking.schema";
import { cancelBooking, createBooking } from "../services/booking.service";

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

export async function cancelBookingController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.userId;
  const bookingId = Number(req.params.id);

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    const cancelledBooking = await cancelBooking(bookingId,userId);

    return res.status(200).json({
      msg: "Booking cancelled successfully",
      cancelledBooking,
    });
  } catch (error) {
    next(error);
  }
}
