"use server";

import { requireUser } from "@/lib/action";
import { db } from "@/db";
import { user } from "@/db/schema";
import { specialistProfile } from "@/db/specialist";
import { eq } from "drizzle-orm";

export async function listUsersForAdmin() {
  const admin = await requireUser();
  if (admin.role !== "ADMIN") {
    throw new Error("Only admin can list users");
  }

  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      hasSpecialistProfile: specialistProfile.id,
    })
    .from(user)
    .leftJoin(specialistProfile, eq(specialistProfile.userId, user.id))
    .orderBy(user.createdAt);

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    isSpecialist: r.role === "SPECIALIST" && r.hasSpecialistProfile != null,
  }));
}
