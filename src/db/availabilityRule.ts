import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { user } from "@/db/schema";

export const availabilityRule = pgTable(
  "availability_rule",
  {
    id: text("id").primaryKey(),
    specialistId: text("specialist_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    weekday: integer("weekday").notNull(),
    startTime: text("start_time").notNull(),
    endTime: text("end_time").notNull(),
    slotDurationMinutes: integer("slot_duration_minutes").notNull(),
    timezone: text("timezone").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    specialistIdx: index("availability_rule_specialist_idx").on(
      table.specialistId,
    ),
  }),
);
