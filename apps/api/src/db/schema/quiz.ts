import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { course } from "./course";
import { user } from "./auth";

// Quiz table - each course can have one quiz
export const quiz = pgTable("quiz", {
    id: text("id").primaryKey(),
    courseId: text("course_id")
        .notNull()
        .references(() => course.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    passingScore: integer("passing_score").notNull().default(70), // Minimum 70% to pass
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Question table - quiz questions
export const question = pgTable("question", {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
        .notNull()
        .references(() => quiz.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    type: text("type").notNull().default("multiple_choice"), // multiple_choice | true_false | short_answer
    options: jsonb("options"), // { a: "Option A", b: "Option B", c: "Option C", d: "Option D" }
    correctAnswer: text("correct_answer").notNull(),
    explanation: text("explanation"), // Why this answer is correct
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Quiz Attempt - tracks user's quiz submissions
export const quizAttempt = pgTable("quiz_attempt", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    quizId: text("quiz_id")
        .notNull()
        .references(() => quiz.id, { onDelete: "cascade" }),
    score: integer("score").notNull(), // 0-100
    passed: boolean("passed").notNull().default(false),
    answers: jsonb("answers"), // { questionId: userAnswer }
    completedAt: timestamp("completed_at").notNull().defaultNow(),
});
