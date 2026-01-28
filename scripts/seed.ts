/**
 * Seed: mock specialists and admin for booking testing.
 *
 * Create:
 * - 2 specialists (specialist1@test.com, specialist2@test.com) with accessibility rules
 * - 1 admin (admin@test.com)
 *
 * Password for both users: password123
 *
 * Run: pnpm db:seed
 * Needed: DATABASE_URL в .env
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { db } from "../src/db";
import { user, account } from "../src/db/schema";
import { specialistProfile } from "../src/db/specialist";
import { availabilityRule } from "../src/db/availabilityRule";
import { eq } from "drizzle-orm";

const TEST_PASSWORD = "password123";

const specialists = [
  {
    email: "specialist1@test.com",
    name: "Anna Specialist",
    bio: "Консультации по фронтенду и TypeScript.",
    tags: "react,typescript,frontend",
  },
  {
    email: "specialist2@test.com",
    name: "Boris Expert",
    bio: "Карьерный коучинг и soft skills.",
    tags: "career,coaching",
  },
];

const adminUser = {
  email: "admin@test.com",
  name: "Admin User",
};

async function ensureUser(
  email: string,
  name: string,
  role: "USER" | "SPECIALIST" | "ADMIN",
) {
  const [existing] = await db.select().from(user).where(eq(user.email, email));
  if (existing) {
    await db.update(user).set({ name, role }).where(eq(user.id, existing.id));
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
    console.error("DATABASE_URL не задан. Добавьте в .env");
    process.exit(1);
  }

  console.log("Seed: создаём тестовых специалистов и админа...\n");

  for (const s of specialists) {
    const id = await ensureUser(s.email, s.name, "SPECIALIST");
    await ensureSpecialistProfile(id, s.bio, s.tags);
    await ensureAvailabilityRules(id);
    console.log("  Специалист:", s.email, "— слоты на ближайшие 14 дней по правилам.");
  }

  await ensureUser(adminUser.email, adminUser.name, "ADMIN");
  console.log("  Админ:", adminUser.email);

  console.log("\nГотово. Пароль для всех тестовых аккаунтов: password123");
  console.log("  Вход: specialist1@test.com, specialist2@test.com, admin@test.com");
  console.log("  Под своим user откройте /specialists и бронируйте слоты.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
