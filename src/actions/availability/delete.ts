"use server";

import { requireUser } from "@/lib/action";
import { availabilityRuleIdSchema } from "./schema";
import { db } from "@/db";
import { availabilityRule } from "@/db/availabilityRule";
import { and, eq } from "drizzle-orm";

export async function deleteAvailabilityRule(input: unknown) {
  const user = await requireUser();

  if (user.role !== "SPECIALIST") {
    throw new Error("Only specialists");
  }

  const { id } = availabilityRuleIdSchema.parse(input);

  const [deleted] = await db
    .delete(availabilityRule)
    .where(
      and(
        eq(availabilityRule.id, id),
        eq(availabilityRule.specialistId, user.id),
      ),
    )
    .returning();

  if (!deleted) {
    throw new Error("Rule not found");
  }

  return deleted;
}
