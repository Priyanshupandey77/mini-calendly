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
    const existingStart = timeToMinutes(existing.startTime);
    const existingEnd = timeToMinutes(existing.endTime);

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

// GET
export async function getAvailability(userId: number) {
  const availability = await prisma.availability.findMany({
    where: {
      userId,
    },
    orderBy: {
      dayOfWeek: "asc",
    },
  });

  return availability;
}

// UPDATE
export async function updateAvailability(
  availabilityId: number,
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

  const existing = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      userId,
    },
  });

  if (!existing) {
    throw new Error("Availability not found");
  }

  const existingSlots = await prisma.availability.findMany({
    where: {
      userId,
      dayOfWeek,
      id: {
        not: availabilityId,
      },
    },
  });

  for (const existing of existingSlots) {
    const existingStart = timeToMinutes(existing.startTime);
    const existingEnd = timeToMinutes(existing.endTime);

    if (startMinutes < existingEnd && endMinutes > existingStart) {
      throw new Error("Availability overlaps with an existing slot");
    }
  }

  const updatedAvailability = await prisma.availability.update({
    where: {
      id: availabilityId,
    },
    data: {
      dayOfWeek,
      startTime,
      endTime,
    },
  });

  return updatedAvailability;
}

// DELETE
export async function deleteAvailability(
  availabilityId: number,
  userId: number,
) {
  const existing = await prisma.availability.findFirst({
    where: {
      id: availabilityId,
      userId,
    },
  });

  if (!existing) {
    throw new Error("Availability not found");
  }

  await prisma.availability.delete({
    where: {
      id: availabilityId,
    },
  });
}
