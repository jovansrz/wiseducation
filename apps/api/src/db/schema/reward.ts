import { pgTable, text, integer, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Reward table - tracks virtual cash rewards for education achievements
export const reward = pgTable("reward", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // level_completion | quiz_perfect | streak
    amount: doublePrecision("amount").notNull(), // Virtual cash amount
    description: text("description").notNull(), // e.g., "Completed Beginner Level"
    awardedAt: timestamp("awarded_at").notNull().defaultNow(),
});

// Learning streak table - tracks consecutive learning days
export const learningStreak = pgTable("learning_streak", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
        .unique(),
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
    lastActivityDate: timestamp("last_activity_date"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Reward amounts configuration (in IDR)
export const REWARD_AMOUNTS = {
    MODULE_COMPLETION: 500_000, // Reward for passing a module quiz
    BEGINNER_COMPLETION: 2_500_000,
    INTERMEDIATE_COMPLETION: 5_000_000,
    ADVANCED_COMPLETION: 10_000_000,
    QUIZ_PERFECT: 500_000,
    STREAK_7_DAY: 1_000_000,
};
