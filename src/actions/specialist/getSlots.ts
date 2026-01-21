"use server";

import { db } from "@/db";
import { availabilityRule } from "@/db/availabilityRule";
import { booking } from "@/db/booking";
import { eq, and, gte, lte, inArray } from "drizzle-orm";

const DAYS = 14;

export async function getSpecialistSlotsNext14Days(specialistId: string) {
  const now = new Date();
  const endDate = new Date();
  endDate.setDate(now.getDate() + DAYS);

  const rules = await db
    .select()
    .from(availabilityRule)
    .where(eq(availabilityRule.specialistId, specialistId));

  const bookings = await db
    .select()
    .from(booking)
    .where(
      and(
        eq(booking.specialistId, specialistId),
        inArray(booking.status, ["REQUESTED", "APPROVED"]),
        gte(booking.startsAt, now),
        lte(booking.startsAt, endDate),
      ),
    );

  const bookedMap = new Set(bookings.map((b) => b.startsAt.toISOString()));

  const slots: {
    startsAt: Date;
    endsAt: Date;
    isBooked: boolean;
  }[] = [];

  for (let dayOffset = 0; dayOffset < DAYS; dayOffset++) {
    const date = new Date(now);
    date.setDate(now.getDate() + dayOffset);

    const weekday = date.getDay(); // 0–6

    const dayRules = rules.filter((r) => r.weekday === weekday);

    for (const rule of dayRules) {
      const [startH, startM] = rule.startTime.split(":").map(Number);
      const [endH, endM] = rule.endTime.split(":").map(Number);

      let cursor = new Date(date);
      cursor.setHours(startH, startM, 0, 0);

      const end = new Date(date);
      end.setHours(endH, endM, 0, 0);

      while (cursor < end) {
        const slotStart = new Date(cursor);
        const slotEnd = new Date(cursor);
        slotEnd.setMinutes(slotEnd.getMinutes() + rule.slotDurationMinutes);

        if (slotEnd > end) break;

        slots.push({
          startsAt: slotStart,
          endsAt: slotEnd,
          isBooked: bookedMap.has(slotStart.toISOString()),
        });

        cursor = slotEnd;
      }
    }
  }

  return slots;
}
