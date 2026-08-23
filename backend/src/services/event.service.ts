import prisma from "../lib/prisma";

export async function createEvent(
  title: string,
  slug: string,
  duration: number,
  userId: number,
) {
  const event = await prisma.event.create({
    data: {
      title,
      slug,
      duration,
      userId,
    },
  });
  return event;
}
