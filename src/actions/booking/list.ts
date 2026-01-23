"use server";

import { requireUser } from "@/lib/action";
import { booking } from "@/db/booking";
import { db } from "@/db";
import { and, desc, eq, inArray } from "drizzle-orm";

export async function listMyBookings() {
  const user = await requireUser();

  const rows = await db
    .select()
    .from(booking)
    .where(eq(booking.userId, user.id))
    .orderBy(desc(booking.startsAt));

  return rows;
}

export async function listSpecialistBookings() {
  const user = await requireUser();

  if (user.role !== "SPECIALIST") {
    throw new Error("Only specialists can view incoming bookings");
  }

  const rows = await db
    .select()
    .from(booking)
    .where(
      and(
        eq(booking.specialistId, user.id),
        inArray(booking.status, ["REQUESTED", "APPROVED", "DECLINED"]),
      ),
    )
    .orderBy(desc(booking.createdAt));

  return rows;
}
