"use server";
import { requireUser } from "@/lib/action";
import { bookingIdSchema } from "@/actions/booking/schema";
import { db } from "@/db";
import { booking } from "@/db/booking";
import { and, eq, inArray } from "drizzle-orm";

export async function cancelBooking(input: unknown) {
  const user = await requireUser();

  if (user.role !== "USER") {
    throw new Error("Only users can cancel bookings");
  }

  const { bookingId } = bookingIdSchema.parse(input);

  const [updated] = await db
    .update(booking)
    .set({
      status: "CANCELLED",
      statusChangedAt: new Date(),
      statusChangedBy: user.id,
    })
    .where(
      and(
        eq(booking.id, bookingId),
        eq(booking.userId, user.id),
        inArray(booking.status, ["REQUESTED", "APPROVED"]),
      ),
    )
    .returning();

  if (!updated) {
    throw new Error("Booking not found, not yours, or cannot be cancelled");
  }

  return updated;
}
