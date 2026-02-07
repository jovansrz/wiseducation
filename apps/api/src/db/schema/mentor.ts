import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const messageSenderEnum = pgEnum("message_sender", ["user", "mentor"]);

export const mentorThreads = pgTable("mentor_threads", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    mentorId: text("mentor_id").notNull(), // ID from the frontend constant
    mentorName: text("mentor_name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mentorMessages = pgTable("mentor_messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id")
        .notNull()
        .references(() => mentorThreads.id, { onDelete: "cascade" }),
    sender: messageSenderEnum("sender").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
