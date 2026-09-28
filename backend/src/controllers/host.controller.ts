import { NextFunction, Request, Response } from "express";
import { getHostBookings } from "../services/host.service";

export async function getHostBookingsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      msg: "Unauthorized",
    });
  }

  try {
    const bookings = await getHostBookings(userId);

    return res.status(200).json({
      msg: "Host bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    next(error);
  }
}
