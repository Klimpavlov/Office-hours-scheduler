"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { specialistProfile } from "@/db/specialist";
import { eq } from "drizzle-orm";

export async function listSpecialists(opts?: { tag?: string }) {
  let q = db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      bio: specialistProfile.bio,
      tags: specialistProfile.tags,
    })
    .from(user)
    .innerJoin(specialistProfile, eq(specialistProfile.userId, user.id))
    .where(eq(user.role, "SPECIALIST"));

  const rows = await q;
  if (opts?.tag?.trim()) {
    const tag = opts.tag.trim().toLowerCase();
    return rows.filter((r) => {
      const t = (r.tags ?? "").toLowerCase();
      return t.includes(tag);
    });
  }
  return rows;
}
