import { Request, Response } from "express";
import { availabilitySchema } from "../schemas/availability.schema";
import { createAvailability } from "../services/availability.service";

export async function createAvailabilityController(
  req: Request,
  res: Response,
) {
  const result = availabilitySchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      msg: "Invalid Input",
      errors: result.error,
    });
  }
  const { dayOfWeek, startTime, endTime } = result.data;
  const userId = req.userId;

  try {
    const availability = await createAvailability(
      dayOfWeek,
      startTime,
      endTime,
      userId,
    );

    return res.status(201).json({
      msg: "Availability created successfully",
      availability,
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
