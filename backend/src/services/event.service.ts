import { AppError } from "../errors/AppError";
import prisma from "../lib/prisma";

export async function createEvent(
  title: string,
  description: string | undefined,
  slug: string,
  duration: number,
  userId: number,
) {
  const event = await prisma.event.create({
    data: {
      title,
      description: description ?? null,
      slug,
      duration,
      userId,
    },
  });

  return event;
}

export async function getEvents(userId: number) {
  const events = await prisma.event.findMany({
    where: {
      userId,
    },
  });

  return events;
}

export async function deleteEvent(userId: number, eventId: number) {
  const result = await prisma.event.deleteMany({
    where: {
      id: eventId,
      userId,
    },
  });

  if (result.count === 0) {
    throw new AppError("Event not found", 404);
  }

  return result;
}