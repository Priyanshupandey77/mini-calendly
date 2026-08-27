import { Request, Response } from "express";
import { createBookingSchema } from "../schemas/booking.schema";
import { createBooking } from "../services/booking.service";

export async function createBookingController(req: Request, res: Response) {
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
    if (error instanceof Error) {
      return res.status(400).json({
        msg: error.message,
      });
    }

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}
