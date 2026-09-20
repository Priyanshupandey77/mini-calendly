import z from "zod";

export const createBookingSchema = z.object({
  eventId: z.number().int().positive(),
  date: z.string().date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  guestName: z.string().trim().min(2),
  guestEmail: z.string().trim().email(),
});
