import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const activity = pgTable("activity", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    type: text("type").notNull(), // trade, quiz, lesson, ai_chat, etc.
    description: text("description").notNull(),
    metadata: jsonb("metadata"), // Additional data depending on activity type
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
