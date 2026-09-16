import { Request, Response } from "express";
import { availabilitySchema } from "../schemas/availability.schema";

import {
  createAvailability,
  getAvailability,
  updateAvailability,
  deleteAvailability,
} from "../services/availability.service";

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

// GET
export async function getAvailabilityController(
  req: Request,
  res: Response,
) {
  const userId = req.userId;

  try {
    const availability = await getAvailability(userId);

    return res.status(200).json({
      availability,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}

// UPDATE
export async function updateAvailabilityController(
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

  const availabilityId = Number(req.params.id);

  if (Number.isNaN(availabilityId)) {
    return res.status(400).json({
      msg: "Invalid availability id",
    });
  }

  const { dayOfWeek, startTime, endTime } = result.data;
  const userId = req.userId;

  try {
    const availability = await updateAvailability(
      availabilityId,
      dayOfWeek,
      startTime,
      endTime,
      userId,
    );

    return res.status(200).json({
      msg: "Availability updated successfully",
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

// DELETE
export async function deleteAvailabilityController(
  req: Request,
  res: Response,
) {
  const availabilityId = Number(req.params.id);

  if (Number.isNaN(availabilityId)) {
    return res.status(400).json({
      msg: "Invalid availability id",
    });
  }

  const userId = req.userId;

  try {
    await deleteAvailability(availabilityId, userId);

    return res.status(200).json({
      msg: "Availability deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        msg: error.message,
      });
    }

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}