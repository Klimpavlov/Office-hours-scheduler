import { z } from "zod";

export const availabilityRuleSchema = z.object({
  id: z.string().optional(),
  weekday: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotDurationMinutes: z.number().int().min(5).max(240),
  timezone: z.string().min(1),
});

export const availabilityRuleIdSchema = z.object({
  id: z.string(),
});
