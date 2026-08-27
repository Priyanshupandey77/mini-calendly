import z from "zod";

export const createBookingSchema = z.object({
  eventId: z.number().int(),
  date: z.string(),
  startTime: z.string(),
  guestName: z.string(),
  guestEmail: z.string().email(),
});
