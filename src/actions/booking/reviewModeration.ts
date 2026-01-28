"use server";

import { requireUser } from "@/lib/action";
import { bookingIdSchema } from "@/actions/booking/schema";
import { db } from "@/db";
import { booking } from "@/db/booking";
import { and, eq } from "drizzle-orm";

/** Specialist or admin marks a flagged booking as reviewed (override). */
export async function reviewModerationOverride(input: unknown) {
  const user = await requireUser();
  if (user.role !== "SPECIALIST" && user.role !== "ADMIN") {
    throw new Error("Only specialist or admin can review moderation");
  }

  const { bookingId } = bookingIdSchema.parse(input);

  const conditions = [eq(booking.id, bookingId)];
  if (user.role === "SPECIALIST") {
    conditions.push(eq(booking.specialistId, user.id));
  }

  const [updated] = await db
    .update(booking)
    .set({
      moderationReviewedAt: new Date(),
      moderationReviewedBy: user.id,
    })
    .where(and(...conditions))
    .returning();

  if (!updated) {
    throw new Error("Booking not found or access denied");
  }
  return updated;
}
