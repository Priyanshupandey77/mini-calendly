import z from "zod";

export const createEventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(100).optional(),
  slug: z.string().min(2).max(100),
  duration: z.number().int().min(15).max(120),
});
