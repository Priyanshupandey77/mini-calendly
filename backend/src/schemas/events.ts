import z from "zod";

export const createEventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  duration: z.number().int().min(15).max(120),
});

export const updateEventSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  duration: z.number().int().min(15).max(120),
});
