import {pgTable, text, timestamp} from "drizzle-orm/pg-core";
import {user} from "@/db/schema";
import {specialistProfile} from "@/db/specialist";

export const booking = pgTable("booking", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    specialistId: text("specialist_id")
        .notNull()
        .references(() => specialistProfile.id),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
});
