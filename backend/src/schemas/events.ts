import z from "zod";

export const createEventSchema = z.object({
  title: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  duration: z.number().int().min(15).max(120),
});
