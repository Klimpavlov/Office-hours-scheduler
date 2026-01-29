"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { specialistProfile } from "@/db/specialist";
import {and, eq, ne} from "drizzle-orm";
import {requireUser} from "@/lib/action";

export async function listSpecialists(opts?: { tag?: string }) {
    const me = await requireUser().catch(()=> null);
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
      .where(
          and(
              eq(user.role, "SPECIALIST"),
              ...(me?.role === "SPECIALIST" ? [ne(user.id, me.id)] : []),
          ),
      );

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
