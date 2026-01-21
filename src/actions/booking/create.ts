"use server";
import { requireUser } from "@/lib/action";
import { createBookingSchema } from "@/actions/booking/schema";
import { db } from "@/db";
import { booking } from "@/db/booking";
import { randomUUID } from "crypto";
import { moderateBookingText } from "@/lib/moderation";

function isPostgresError(err: unknown): err is { code: string } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as any).code === "string"
  );
}

export async function createBooking(input: unknown) {
  const user = await requireUser();

  if (user.role !== "USER") {
    throw new Error("Only user can create bookings");
  }

  const data = createBookingSchema.parse(input);
  const moderation = await moderateBookingText(data.description);

  if (moderation.status === "REJECTED") {
    throw new Error("Booking rejected by moderation");
  }

  try {
    const [created] = await db
      .insert(booking)
      .values({
        id: randomUUID(),
        userId: user.id,
        specialistId: data.specialistId,
        startsAt: new Date(data.startsAt),
        endsAt: new Date(data.endsAt),
        status: "REQUESTED",
        moderationStatus: moderation.status,
        moderationReason: moderation.reason ?? null,
      })
      .returning();

    return created;
  } catch (err) {
    if (isPostgresError(err) && err.code === "23505") {
      throw new Error("This slot is already booked");
    }

    throw err;
  }
}
