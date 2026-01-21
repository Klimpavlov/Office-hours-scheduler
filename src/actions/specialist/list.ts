'use server';

import { db } from "@/db";
import { user } from "@/db/schema";
import { specialistProfile } from "@/db/specialist";
import { eq } from "drizzle-orm";

export async function listSpecialists() {
    const rows = await db
        .select({
            id:user.id,
            name:user.name,
            image: user. image,
            bio: specialistProfile.bio
        })
        .from(user)
        .innerJoin(
            specialistProfile,
            eq(specialistProfile.userId, user.id)
        )
        .where(eq(user.role, "SPECIALIST"))

    return rows
}