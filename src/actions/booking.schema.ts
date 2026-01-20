import z from "zod";
export const createBookingSchema = z.object({
  specialistId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
