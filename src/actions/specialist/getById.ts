"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { specialistProfile } from "@/db/specialist";
import { and, eq } from "drizzle-orm";

export async function getSpecialistById(specialistId: string) {
  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      bio: specialistProfile.bio,
    })
    .from(user)
    .innerJoin(specialistProfile, eq(specialistProfile.userId, user.id))
    .where(and(eq(user.id, specialistId), eq(user.role, "SPECIALIST")));

  if (!row) {
    throw new Error("Specialist not found");
  }

  return row;
}
