import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const course = pgTable("course", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    difficulty: text("difficulty").notNull().default("Beginner"), // Beginner, Intermediate, Advanced
    coverImageUrl: text("cover_image_url"),
    thumbnailUrl: text("thumbnail_url"),
    type: text("type").notNull().default("text"), // video | text | interactive
    youtubeUrl: text("youtube_url"), // If type = "video"
    order: integer("order").notNull().default(0), // Order within difficulty level
    totalDurationMinutes: integer("total_duration_minutes").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lesson = pgTable("lesson", {
    id: text("id").primaryKey(),
    courseId: text("course_id")
        .notNull()
        .references(() => course.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    content: text("content"), // Markdown content for text lessons
    videoUrl: text("video_url"), // YouTube URL for video lessons
    type: text("type").notNull().default("text"), // video | text
    order: integer("order").notNull().default(0),
    durationMinutes: integer("duration_minutes").default(0),
    resources: jsonb("resources"), // { links: [], pdfs: [] }
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userCourseProgress = pgTable("user_course_progress", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    courseId: text("course_id")
        .notNull()
        .references(() => course.id, { onDelete: "cascade" }),
    progress: integer("progress").notNull().default(0), // 0-100
    videoProgress: integer("video_progress").notNull().default(0), // 0-100
    completed: boolean("completed").notNull().default(false),
    lastLessonId: text("last_lesson_id").references(() => lesson.id),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Lesson progress - tracks individual lesson completion
export const userLessonProgress = pgTable("user_lesson_progress", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
        .notNull()
        .references(() => lesson.id, { onDelete: "cascade" }),
    completed: boolean("completed").notNull().default(false),
    videoWatchedPercent: integer("video_watched_percent").notNull().default(0), // 0-100
    lastWatchedAt: timestamp("last_watched_at"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

