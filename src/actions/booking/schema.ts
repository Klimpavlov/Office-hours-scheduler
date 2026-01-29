import { z } from "zod";
import {
  validateTiptapDoc,
  getTextFromTiptapJson,
  MAX_DESCRIPTION_CHARS,
  type TiptapDoc,
} from "@/lib/rich-text";

const tiptapDocSchema = z
  .record(z.string(), z.unknown())
  .refine((v) => validateTiptapDoc(v as TiptapDoc), {
    message: `Invalid rich-text: only doc/paragraph/text/bold/italic/link/lists allowed, max ${MAX_DESCRIPTION_CHARS} chars`,
  })
  .refine((v) => getTextFromTiptapJson(v as TiptapDoc).trim().length >= 1, {
    message: "Description cannot be empty",
  }) as z.ZodType<TiptapDoc>;

export const createBookingSchema = z.object({
  specialistId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  descriptionJson: z.custom<TiptapDoc>(),
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
