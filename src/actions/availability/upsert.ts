"use server";

import { randomUUID } from "crypto";
import { requireUser } from "@/lib/action";
import { availabilityRuleSchema } from "./schema";
import { db } from "@/db";
import { availabilityRule } from "@/db/availabilityRule";
import { eq } from "drizzle-orm";

export async function upsertAvailabilityRule(input: unknown) {
  const user = await requireUser();

  if (user.role !== "SPECIALIST") {
    throw new Error("Only specialists");
  }

  const data = availabilityRuleSchema.parse(input);

  // update
  if (data.id) {
    const [updated] = await db
      .update(availabilityRule)
      .set({
        weekday: data.weekday,
        startTime: data.startTime,
        endTime: data.endTime,
        slotDurationMinutes: data.slotDurationMinutes,
        timezone: data.timezone,
      })
      .where(eq(availabilityRule.id, data.id))
      .returning();

    if (!updated) {
      throw new Error("Rule not found");
    }

    return updated;
  }

  // create
  const [created] = await db
    .insert(availabilityRule)
    .values({
      id: randomUUID(),
      specialistId: user.id,
      weekday: data.weekday,
      startTime: data.startTime,
      endTime: data.endTime,
      slotDurationMinutes: data.slotDurationMinutes,
      timezone: data.timezone,
    })
    .returning();

  return created;
}
