import z from "zod";

export const availabilitySchema = z.object({
    dayOfWeek: z.number().int().min(1).max(7),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
})