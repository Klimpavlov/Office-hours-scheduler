import { z } from "zod";
export const createBookingSchema = z.object({
  specialistId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

export const bookingIdSchema = z.object({
  bookingId: z.string().uuid(),
});

export const bookingListSchema = z.object({
  status: z.enum(["REQUESTED", "APPROVED", "DECLINED", "CANCELLED"]).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type BookingIdInput = z.infer<typeof bookingIdSchema>;
export type BookingListInput = z.infer<typeof bookingListSchema>;
