import { Request, Response } from "express";
import { createEventSchema } from "../schemas/events.js";
import { createEvent } from "../services/event.service.js";
import { Prisma } from "@prisma/client";

export async function createEventController(req: Request, res: Response) {
  const result = createEventSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      msg: "invalid input",
      errors: result.error,
    });
  }
  const { title, slug, duration } = result.data;
  const userId = req.userId;
  try {
    const event = await createEvent(title, slug, duration, userId);

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
