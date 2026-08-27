import prisma from "../lib/prisma";

function timeToMinutes(time: string) {
  const splitTime = time.split(":");
  const hours = Number(splitTime[0]);
  const minutes = Number(splitTime[1]);
  const totalMinutes = hours * 60 + minutes;
  return totalMinutes;
}

function addMinutes(time: string, duration: number) {
  const totalMinutes = timeToMinutes(time);
  const totalTime = totalMinutes + duration;

  const convertedHours = Math.floor(totalTime / 60);
  const convertedMinutes = totalTime % 60;
  return `${String(convertedHours).padStart(2, "0")}:${String(convertedMinutes).padStart(2, "0")}`;
}

export async function createBooking(
  eventId: number,
  guestName: string,
  guestEmail: string,
  date: Date,
  startTime: string,
) {
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
    },
  });
  if (!event) {
    throw new Error("event do not exists!!");
  }
  const endTime = addMinutes(startTime, event.duration);
  const jsDay = date.getDay();
  const dayOfWeek = ((jsDay + 6) % 7) + 1;
  const availability = await prisma.availability.findMany({
    where: {
      userId: event.userId,
      dayOfWeek,
    },
  });
  const bookingStart = timeToMinutes(startTime);
  const bookingEnd = timeToMinutes(endTime);
  let isWithinAvailability = false;
  for (const existing of availability) {
    const availabilityStart = timeToMinutes(existing.startTime);
    const availabilityEnd = timeToMinutes(existing.endTime);
    if (bookingStart >= availabilityStart && bookingEnd <= availabilityEnd) {
      isWithinAvailability = true;
      break;
    }
  }
  if (!isWithinAvailability) {
    throw new Error("Booking time is outside host availability");
  }

  const existingBookings = await prisma.booking.findMany({
    where: {
      userId: event.userId,
      date,
    },
  });

  for (const existing of existingBookings) {
    const existingStart = timeToMinutes(existing.startTime);

    const existingEnd = timeToMinutes(existing.endTime);

    if (bookingStart < existingEnd && bookingEnd > existingStart) {
      throw new Error("Booking overlaps with an existing slot");
    }
  }

  const booking = await prisma.booking.create({
    data: {
      guestName,
      guestEmail,
      date,
      startTime,
      endTime,
      userId: event.userId,
      eventId,
    },
  });
  return booking;
}
