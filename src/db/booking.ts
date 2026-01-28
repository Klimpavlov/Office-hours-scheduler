import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
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

/** Rich-text content stored as Tiptap JSON. See README for allowed shape. */
export const booking = pgTable(
  "booking",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id),
    specialistId: text("specialist_id")
      .notNull()
      .references(() => user.id),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    status: bookingStatusEnum("status").default("REQUESTED").notNull(),
    /** Rich-text description (Tiptap JSON). */
    descriptionJson: jsonb("description_json").$type<Record<string, unknown>>(),
    moderationStatus: moderationStatusEnum("moderation_status")
      .default("PENDING")
      .notNull(),
    moderationReason: text("moderation_reason"),
    moderationCategories: jsonb("moderation_categories").$type<string[]>(),
    moderationModel: text("moderation_model"),
    moderationProvider: text("moderation_provider"),
    moderationReviewedAt: timestamp("moderation_reviewed_at"),
    moderationReviewedBy: text("moderation_reviewed_by").references(
      () => user.id,
    ),
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
    /** Concurrency: one booking per (specialist, startsAt). Prevents double-booking. */
    uniqueSlot: uniqueIndex("booking_specialist_starts_at_unique").on(
      table.specialistId,
      table.startsAt,
    ),
    specialistIdx: index("booking_specialist_idx").on(table.specialistId),
    userIdx: index("booking_user_idx").on(table.userId),
  }),
);
