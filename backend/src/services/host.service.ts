import prisma from "../lib/prisma";

export async function getHostBookings(userId: number) {
  const bookings = await prisma.booking.findMany({
    where: {
      userId,
    },
    include: {
      event: true,
    },
  });
  return bookings;
}
