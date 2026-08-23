import prisma from "../lib/prisma";

function timeToMinutes(time: string) {
  const splitedTime = time.split(":");
  const hours = Number(splitedTime[0]);
  const minutes = Number(splitedTime[1]);
  const totalTime = hours * 60 + minutes;
  return totalTime;
}

export async function existingAvailability(dayOfWeek: number, userId: number) {
  const existingAvailability = await prisma.availability.findMany({
    where: {
      userId,
      dayOfWeek,
    },
  });

  return existingAvailability;
}

export async function createAvailability(
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  userId: number,
) {
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  if (startMinutes >= endMinutes) {
    throw new Error("Start time must be before end time");
  }
  const existingSlots = await existingAvailability(dayOfWeek, userId);
  for (const existing of existingSlots) {
    // convert existing.startTime
    const existingStart = timeToMinutes(existing.startTime);
    // convert existing.endTime
    const existingEnd = timeToMinutes(existing.endTime);
    // check overlap
    if (startMinutes < existingEnd && endMinutes > existingStart) {
      throw new Error("Availability overlaps with an existing slot");
    }
  }

  const availability = await prisma.availability.create({
    data: {
      dayOfWeek,
      startTime,
      endTime,
      userId,
    },
  });

  return availability;
}
