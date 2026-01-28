import { z } from "zod";

export const availabilityRuleSchema = z.object({
  id: z.string().optional(),
  weekday: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  slotDurationMinutes: z.number().int().min(5).max(240),
  timezone: z.string().min(1).refine((s) => /^[A-Za-z0-9_+-]+\/[A-Za-z0-9_+-]+$/.test(s), {
    message: "Use IANA timezone (e.g. Europe/Berlin)",
  }),
});

export const availabilityRuleIdSchema = z.object({
  id: z.string(),
});
