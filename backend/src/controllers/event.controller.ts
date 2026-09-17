import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import { createEventSchema } from "../schemas/events.js";
import {
  createEvent,
  deleteEvent,
  getAvailableSlots,
  getEvents,
  getPublicEvent,
} from "../services/event.service.js";
import { AppError } from "../errors/AppError.js";

export async function getAvailableSlotsController(req: Request, res: Response) {
  const slug = req.params.slug;

  if (typeof slug !== "string") {
    return res.status(400).json({
      msg: "Invalid event slug",
    });
  }

  const date = req.query.date;

  if (typeof date !== "string") {
    return res.status(400).json({
      msg: "Invalid date",
    });
  }

  try {
    const slots = await getAvailableSlots(slug, date);
    return res.status(200).json({
      date,
      slots,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}

export async function createEventController(req: Request, res: Response) {
  const result = createEventSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      msg: "invalid input",
      errors: result.error,
    });
  }

  const { title, description, slug, duration } = result.data;
  const userId = req.userId;

  try {
    const event = await createEvent(title, description, slug, duration, userId);

    return res.status(201).json({
      msg: "event created successfully",
      event,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({
        msg: "An event with this slug already exists",
      });
    }

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}

export async function getEventsController(req: Request, res: Response) {
  const userId = req.userId;

  try {
    const events = await getEvents(userId);

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}

export async function getPublicEventController(req: Request, res: Response) {
  const slug = req.params.slug;
  if (typeof slug !== "string") {
    return res.status(400).json({
      msg: "Invalid event slug",
    });
  }

  try {
    const event = await getPublicEvent(slug);

    return res.status(200).json({
      event,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}

export async function deleteEventController(req: Request, res: Response) {
  const eventId = Number(req.params.id);
  const userId = req.userId;

  if (Number.isNaN(eventId)) {
    return res.status(400).json({
      msg: "Invalid event ID",
    });
  }

  try {
    await deleteEvent(userId, eventId);

    return res.status(200).json({
      msg: "Event deleted successfully",
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }

    return res.status(500).json({
      msg: "Internal server error",
    });
  }
}
