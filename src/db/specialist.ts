import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "@/db/schema";

export const specialistProfile = pgTable("specialist_profile", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  bio: text("bio"),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
