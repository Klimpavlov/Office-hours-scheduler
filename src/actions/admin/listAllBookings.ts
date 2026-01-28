"use server";

import { requireUser } from "@/lib/action";
import { db } from "@/db";
import { booking } from "@/db/booking";
import { user } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function listAllBookingsForAdmin() {
  const admin = await requireUser();
  if (admin.role !== "ADMIN") {
    throw new Error("Only admin can list all bookings");
  }

  const rows = await db
    .select({
      id: booking.id,
      userId: booking.userId,
      specialistId: booking.specialistId,
      startsAt: booking.startsAt,
      endsAt: booking.endsAt,
      status: booking.status,
      moderationStatus: booking.moderationStatus,
      moderationReason: booking.moderationReason,
      moderationReviewedAt: booking.moderationReviewedAt,
      userName: user.name,
    })
    .from(booking)
    .leftJoin(user, eq(user.id, booking.userId))
    .orderBy(desc(booking.createdAt));

  return rows;
}
