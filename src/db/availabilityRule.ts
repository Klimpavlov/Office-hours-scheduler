import {
    pgTable,
    text,
    integer,
    timestamp,
    index,
} from "drizzle-orm/pg-core";
import { user } from "@/db/schema";

export const availabilityRule = pgTable(
    "availability_rule",
    {
        id: text("id").primaryKey(),

        specialistId: text("specialist_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),

        /**
         * 0 = Sunday, 6 = Saturday
         */
        weekday: integer("weekday").notNull(),

        /**
         * Stored as "HH:mm"
         * Example: "10:00"
         */
        startTime: text("start_time").notNull(),

        /**
         * Stored as "HH:mm"
         * Example: "16:00"
         */
        endTime: text("end_time").notNull(),

        /**
         * Slot duration in minutes
         * Example: 30
         */
        slotDurationMinutes: integer("slot_duration_minutes").notNull(),

        /**
         * IANA timezone
         * Example: "Europe/Berlin"
         */
        timezone: text("timezone").notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        specialistIdx: index("availability_rule_specialist_idx").on(
            table.specialistId
        ),
    })
);
