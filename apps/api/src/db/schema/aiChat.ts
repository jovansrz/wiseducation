import { pgTable, text, timestamp, uuid, varchar, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const aiRoleEnum = pgEnum("ai_role", ["user", "assistant"]);

export const aiThreads = pgTable("ai_threads", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").references(() => user.id).notNull(),
    title: varchar("title", { length: 255 }).notNull().default("New Chat"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aiMessages = pgTable("ai_messages", {
    id: uuid("id").primaryKey().defaultRandom(),
    threadId: uuid("thread_id").references(() => aiThreads.id, { onDelete: 'cascade' }).notNull(),
    role: aiRoleEnum("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
