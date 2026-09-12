import z from "zod";

const eventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(100).optional(),
  duration: z.number().int().min(15).max(120),
  slug: z.string().min(2).max(100),
});

export default eventSchema;