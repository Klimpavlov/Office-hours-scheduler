/**
 * Seed: demo users for booking system testing
 *
 * Creates:
 * - 1 specialist with availability rules
 * - 1 admin
 * - 1 normal user
 *
 * Password for all users: password123
 *
 * Run:
 *   pnpm db:seed
 *
 * Requires:
 *   DATABASE_URL in .env
 */

import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";

import { db } from "../src/db";
import { user, account } from "../src/db/schema";
import { specialistProfile } from "../src/db/specialist";
import { availabilityRule } from "../src/db/availabilityRule";

const TEST_PASSWORD = "password123";

const specialistUser = {
  email: "specialist@test.com",
  name: "Anna Specialist",
  bio: "Frontend and TypeScript consulting.",
  tags: "react,typescript,frontend",
};

const adminUser = {
  email: "admin@test.com",
  name: "Admin User",
};

const normalUser = {
  email: "user@test.com",
  name: "John User",
};

async function ensureUser(
    email: string,
    name: string,
    role: "USER" | "SPECIALIST" | "ADMIN",
) {
  const [existing] = await db
      .select()
      .from(user)
      .where(eq(user.email, email));

  if (existing) {
    await db
        .update(user)
        .set({ name, role })
        .where(eq(user.id, existing.id));
    return existing.id;
  }

  const id = randomUUID();
  const passwordHash = await hashPassword(TEST_PASSWORD);

  await db.insert(user).values({
    id,
    name,
    email,
    emailVerified: true,
    role,
  });

  await db.insert(account).values({
    id: randomUUID(),
    accountId: id,
    providerId: "credential",
    userId: id,
    password: passwordHash,
  });

  return id;
}

async function ensureSpecialistProfile(
    userId: string,
    bio: string,
    tags: string,
) {
  const [existing] = await db
      .select()
      .from(specialistProfile)
      .where(eq(specialistProfile.userId, userId));

  if (existing) {
    await db
        .update(specialistProfile)
        .set({ bio, tags })
        .where(eq(specialistProfile.id, existing.id));
    return;
  }

  await db.insert(specialistProfile).values({
    id: randomUUID(),
    userId,
    bio,
    tags,
  });
}

async function ensureAvailabilityRules(specialistId: string) {
  const existing = await db
      .select()
      .from(availabilityRule)
      .where(eq(availabilityRule.specialistId, specialistId));

  if (existing.length > 0) return;

  const rules = [
    { weekday: 1, start: "09:00", end: "12:00", tz: "Europe/Berlin" },
    { weekday: 1, start: "14:00", end: "17:00", tz: "Europe/Berlin" },
    { weekday: 2, start: "09:00", end: "17:00", tz: "Europe/Berlin" },
    { weekday: 3, start: "10:00", end: "16:00", tz: "Europe/Berlin" },
    { weekday: 4, start: "09:00", end: "13:00", tz: "Europe/Berlin" },
  ];

  for (const r of rules) {
    await db.insert(availabilityRule).values({
      id: randomUUID(),
      specialistId,
      weekday: r.weekday,
      startTime: r.start,
      endTime: r.end,
      slotDurationMinutes: 30,
      timezone: r.tz,
    });
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing. Add it to .env");
    process.exit(1);
  }

  console.log("Seeding demo users...\n");

  // Specialist
  const specialistId = await ensureUser(
      specialistUser.email,
      specialistUser.name,
      "SPECIALIST",
  );
  await ensureSpecialistProfile(
      specialistId,
      specialistUser.bio,
      specialistUser.tags,
  );
  await ensureAvailabilityRules(specialistId);

  console.log(
      "  Specialist created:",
      specialistUser.email,
      "(availability rules applied)",
  );

  // Admin
  await ensureUser(adminUser.email, adminUser.name, "ADMIN");
  console.log("  Admin created:", adminUser.email);

  // Normal user
  await ensureUser(normalUser.email, normalUser.name, "USER");
  console.log("  User created:", normalUser.email);

  console.log("\nSeed completed successfully.");
  console.log("Password for all accounts:", TEST_PASSWORD);
  console.log("Logins:");
  console.log("  Specialist:", specialistUser.email);
  console.log("  Admin:", adminUser.email);
  console.log("  User:", normalUser.email);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
