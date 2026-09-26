import { Booking, BookingStatus } from "@prisma/client";
import { AppError } from "../errors/AppError";
import prisma from "../lib/prisma";

function timeToMinutes(time: string) {
  const splitedTime = time.split(":");
  const hours = Number(splitedTime[0]);
  const minutes = Number(splitedTime[1]);
  const totalTime = hours * 60 + minutes;

  return totalTime;
}

function generateTimeSlots(
  startTime: string,
  endTime: string,
  duration: number,
) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  const slots: string[] = [];
  let current = startMinutes;

  while (current + duration <= endMinutes) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    slots.push(time);
    current += duration;
  }
  return slots;
}

function isSlotBooked(
  slotStart: string,
  duration: number,
  bookings: Booking[],
) {
  const slotStartMinutes = timeToMinutes(slotStart);
  const slotEndMinutes = slotStartMinutes + duration;
  for (const booking of bookings) {
    const bookingStartMinutes = timeToMinutes(booking.startTime);
    const bookingEndMinutes = timeToMinutes(booking.endTime);
    if (
      slotStartMinutes < bookingEndMinutes &&
      slotEndMinutes > bookingStartMinutes
    ) {
      return true;
    }
  }
  return false;
}

function getDayOfWeek(date: Date) {
  const dayOfWeek = ((date.getDay() + 6) % 7) + 1;
  return dayOfWeek;
}

export async function getAvailableSlots(slug: string, dateString: string) {
  const event = await prisma.event.findUnique({
    where: {
      slug,
    },
  });
  if (!event) {
    throw new AppError("Event not found", 404);
  }
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    throw new AppError("Invalid date", 400);
  }
  const dayOfWeek = getDayOfWeek(date);

  const availability = await prisma.availability.findMany({
    where: {
      userId: event.userId,
      dayOfWeek,
    },
  });
  if (availability.length === 0) {
    return [];
  }
  const slots: string[] = [];
  for (const slot of availability) {
    const generatedSlots = generateTimeSlots(
      slot.startTime,
      slot.endTime,
      event.duration,
    );

    slots.push(...generatedSlots);
  }
  const bookings = await prisma.booking.findMany({
    where: {
      eventId: event.id,
      date,
      status: BookingStatus.CONFIRMED,
    },
  });
  const availableSlots = slots.filter((slot) => {
    return !isSlotBooked(slot, event.duration, bookings);
  });
  return availableSlots;
}

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

export async function getPublicEvent(slug: string) {
  const event = await prisma.event.findUnique({
    where: {
      slug,
    },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  return event;
}

export async function updateEvent(
  eventId: number,
  userId: number,
  title: string,
  description: string | undefined,
  slug: string,
  duration: number,
) {
  const event = await prisma.event.findFirst({
    where: {
      id: eventId,
      userId,
    },
  });

  if (!event) {
    throw new AppError("Event not found", 404);
  }

  const updatedEvent = await prisma.event.update({
    where: {
      id: eventId,
    },
    data: {
      title,
      description: description ?? null,
      slug,
      duration,
    },
  });

  return updatedEvent;
}

export async function deleteEvent(userId: number, eventId: number) {
  const check = await prisma.event.findUnique({
    where: {
      id: eventId,
      userId,
    },
    include: {
      _count: {
        select: {
          bookings: true,
        },
      },
    },
  });

  if (check === null) {
    throw new AppError("Event not found", 404);
  }

  if (check._count.bookings > 0) {
    throw new AppError("Event has bookings", 409);
  }

  const result = await prisma.event.deleteMany({
    where: {
      id: eventId,
      userId,
    },
  });

  return result;
}
