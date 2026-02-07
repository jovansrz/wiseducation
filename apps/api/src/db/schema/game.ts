import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Game scores - individual game sessions
export const gameScore = pgTable("game_score", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id),
    gameType: text("game_type").notNull(), // 'tetris' | 'wise_jump'
    score: integer("score").notNull(),
    linesCleared: integer("lines_cleared"), // For tetris
    coinsCollected: integer("coins_collected"), // For wise_jump
    distance: integer("distance"), // For wise_jump (in meters)
    wiseCashEarned: integer("wise_cash_earned").notNull(),
    playedAt: timestamp("played_at").notNull().defaultNow(),
});

// Aggregated game stats per user
export const gameStats = pgTable("game_stats", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id)
        .unique(),
    // Tetris stats
    tetrisHighScore: integer("tetris_high_score").notNull().default(0),
    tetrisGamesPlayed: integer("tetris_games_played").notNull().default(0),
    tetrisTotalLinesCleared: integer("tetris_total_lines_cleared").notNull().default(0),
    // Wise Jump stats
    wiseJumpHighScore: integer("wise_jump_high_score").notNull().default(0),
    wiseJumpGamesPlayed: integer("wise_jump_games_played").notNull().default(0),
    wiseJumpTotalCoins: integer("wise_jump_total_coins").notNull().default(0),
    wiseJumpBestDistance: integer("wise_jump_best_distance").notNull().default(0),
    // Combined
    totalWiseCashEarned: integer("total_wise_cash_earned").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
