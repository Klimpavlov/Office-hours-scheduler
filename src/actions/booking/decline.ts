"use server";
import { requireUser } from "@/lib/action";
import { bookingIdSchema } from "@/actions/booking/schema";
import { db } from "@/db";
import { booking } from "@/db/booking";
import { and, eq } from "drizzle-orm";

export async function declineBooking(input: unknown) {
  const user = await requireUser();

  if (user.role !== "SPECIALIST") {
    throw new Error("Only specialists can decline bookings");
  }
  const { bookingId } = bookingIdSchema.parse(input);

  const [updated] = await db
    .update(booking)
    .set({
      status: "DECLINED",
      statusChangedAt: new Date(),
      statusChangedBy: user.id,
    })
    .where(
      and(
        eq(booking.id, bookingId),
        eq(booking.specialistId, user.id),
        eq(booking.status, "REQUESTED"),
      ),
    )
    .returning();

  if (!updated) {
    throw new Error("Booking not found, not yours, or already processed");
  }

  return updated;
}
