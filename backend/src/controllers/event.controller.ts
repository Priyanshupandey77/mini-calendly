import { NextFunction, Request, Response } from "express";

import { createEventSchema, updateEventSchema } from "../schemas/events.js";
import {
  createEvent,
  deleteEvent,
  getAvailableSlots,
  getEvents,
  getPublicEvent,
  updateEvent,
} from "../services/event.service.js";

export async function getAvailableSlotsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    next(error);
  }
}

export async function createEventController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    next(error);
  }
}

export async function getEventsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.userId;

  try {
    const events = await getEvents(userId);

    return res.status(200).json(events);
  } catch (error) {
    next(error);
  }
}

export async function getPublicEventController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    next(error);
  }
}

export async function updateEventController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const eventId = Number(req.params.id);
  const userId = req.userId;

  if (Number.isNaN(eventId)) {
    return res.status(400).json({
      msg: "Invalid event ID",
    });
  }

  const result = updateEventSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      msg: "invalid input",
      errors: result.error,
    });
  }

  const { title, description, slug, duration } = result.data;

  try {
    const event = await updateEvent(
      eventId,
      userId,
      title,
      description,
      slug,
      duration,
    );

    return res.status(200).json({
      msg: "Event updated successfully",
      event,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEventController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
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
    next(error);
  }
}
