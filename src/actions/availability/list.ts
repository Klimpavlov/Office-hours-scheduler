"use server";

import { requireUser } from "@/lib/action";
import { db } from "@/db";
import { availabilityRule } from "@/db/availabilityRule";
import { eq } from "drizzle-orm";

export async function listMyAvailabilityRules() {
  const user = await requireUser();

  if (user.role !== "SPECIALIST") {
    throw new Error("Only specialists");
  }

  return db
    .select()
    .from(availabilityRule)
    .where(eq(availabilityRule.specialistId, user.id))
    .orderBy(availabilityRule.weekday, availabilityRule.startTime);
}
