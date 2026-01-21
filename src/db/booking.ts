import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { specialistProfile } from "@/db/specialist";
import { user } from "@/db/schema";

export const bookingStatusEnum = pgEnum("booking_status", [
  "REQUESTED",
  "APPROVED",
  "DECLINED",
  "CANCELLED",
]);

export const moderationStatusEnum = pgEnum("moderation_status", [
  "PENDING",
  "APPROVED",
  "FLAGGED",
  "REJECTED",
]);

export const booking = pgTable(
  "booking",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    specialistId: text("specialist_id")
      .notNull()
      .references(() => specialistProfile.id),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    status: bookingStatusEnum("status").default("REQUESTED").notNull(),
    moderationStatus: moderationStatusEnum("moderation_status")
      .default("PENDING")
      .notNull(),
    moderationReason: text("moderation_reason"),
      approvedAt: timestamp("approved_at"),
      approvedBy: text("approved_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    statusChangedAt: timestamp("status_changed_at"),
    statusChangedBy: text("status_changed_by"),
  },
  (table) => ({
    uniqueSlot: index("booking_unique_slot")
      .on(table.specialistId, table.startsAt)
  }),
);
