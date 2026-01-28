"use server";

import { db } from "@/db";
import { availabilityRule } from "@/db/availabilityRule";
import { booking } from "@/db/booking";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import { addDays } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

const DAYS = 14;

/**
 * Slots are generated on-the-fly from availability rules for the next 14 days.
 * Rule start/end times are interpreted in the rule's IANA timezone; slot startsAt/endsAt are UTC.
 */
export async function getSpecialistSlotsNext14Days(specialistId: string) {
  const now = new Date();
  const endDate = addDays(now, DAYS);

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

  const bookedSet = new Set(bookings.map((b) => b.startsAt.getTime()));

  const slots: { startsAt: Date; endsAt: Date; isBooked: boolean }[] = [];

  for (const rule of rules) {
    const [startH, startM] = rule.startTime.split(":").map(Number);
    const [endH, endM] = rule.endTime.split(":").map(Number);
    const tz = rule.timezone;

    for (let dayOffset = 0; dayOffset < DAYS; dayOffset++) {
      const todayInTz = toZonedTime(now, tz);
      const thatDay = addDays(todayInTz, dayOffset);
      const weekday = thatDay.getDay();
      if (weekday !== rule.weekday) continue;

      const y = thatDay.getFullYear();
      const mo = thatDay.getMonth();
      const d = thatDay.getDate();

      const localStart = new Date(y, mo, d, startH, startM, 0, 0);
      const localEnd = new Date(y, mo, d, endH, endM, 0, 0);
      let cursor = fromZonedTime(localStart, tz);
      const endUtc = fromZonedTime(localEnd, tz);

      while (cursor < endUtc) {
        const slotStart = new Date(cursor);
        const slotEnd = new Date(cursor.getTime() + rule.slotDurationMinutes * 60 * 1000);
        if (slotEnd > endUtc) break;

        slots.push({
          startsAt: slotStart,
          endsAt: slotEnd,
          isBooked: bookedSet.has(slotStart.getTime()),
        });
        cursor = slotEnd;
      }
    }
  }

  slots.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  return slots;
}
