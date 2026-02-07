import { pgTable, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const post = pgTable("post", {
    id: text("id").primaryKey(),
    authorId: text("author_id")
        .notNull()
        .references(() => user.id),
    content: text("content").notNull(),
    type: text("type").notNull().default("text"), // text, image, poll
    imageUrl: text("image_url"),
    pollOptions: jsonb("poll_options"), // Array of { label: string, votes: number }
    tags: jsonb("tags").default([]), // Array of strings
    upvotes: integer("upvotes").notNull().default(0),
    downvotes: integer("downvotes").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const comment = pgTable("comment", {
    id: text("id").primaryKey(),
    postId: text("post_id")
        .notNull()
        .references(() => post.id),
    authorId: text("author_id")
        .notNull()
        .references(() => user.id),
    content: text("content").notNull(),
    parentId: text("parent_id"), // For nested comments
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const vote = pgTable("vote", {
    id: text("id").primaryKey(),
    postId: text("post_id")
        .notNull()
        .references(() => post.id),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    direction: integer("direction").notNull(), // 1 for upvote, -1 for downvote
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
