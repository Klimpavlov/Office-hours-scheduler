"use server";

import { randomUUID } from "crypto";
import { requireUser } from "@/lib/action";
import { db } from "@/db";
import { user } from "@/db/schema";
import { specialistProfile } from "@/db/specialist";
import { eq } from "drizzle-orm";

export async function promoteToSpecialist(userId: string) {
  const admin = await requireUser();

  if (admin.role !== "ADMIN") {
    throw new Error("Only admin can promote users");
  }

  const [target] = await db.select().from(user).where(eq(user.id, userId));

  if (!target) {
    throw new Error("User not found");
  }

  if (target.role !== "SPECIALIST") {
    await db
      .update(user)
      .set({ role: "SPECIALIST" })
      .where(eq(user.id, userId));
  }

  const [existing] = await db
    .select()
    .from(specialistProfile)
    .where(eq(specialistProfile.userId, userId));

  if (!existing) {
    await db.insert(specialistProfile).values({
      id: randomUUID(),
      userId,
      bio: null,
    });
  }

  return { ok: true };
}
