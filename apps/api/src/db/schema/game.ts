import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

// Game score table - tracks individual game sessions
export const gameScore = pgTable("game_score", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    gameType: text("game_type").notNull().default("tetris"),
    score: integer("score").notNull().default(0),
    linesCleared: integer("lines_cleared").notNull().default(0),
    cashEarned: integer("cash_earned").notNull().default(0), // In Rupiah
    comboCount: integer("combo_count").notNull().default(0),
    maxCombo: integer("max_combo").notNull().default(0),
    duration: integer("duration"), // In seconds
    playedAt: timestamp("played_at").notNull().defaultNow(),
});

// Virtual transaction table - tracks all virtual cash movements
export const virtualTransaction = pgTable("virtual_transaction", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // "GAME_REWARD", "COURSE_COMPLETION", "LEVEL_UP"
    amount: integer("amount").notNull(), // Positive for rewards, negative for spending
    description: text("description").notNull(),
    metadata: text("metadata"), // JSON string for extra data like { gameScoreId, lines, combo }
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User game stats table - tracks accumulated game stats per user
export const userGameStats = pgTable("user_game_stats", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" })
        .unique(),
    virtualBalance: integer("virtual_balance").notNull().default(10000000), // 10M IDR initial
    tetrisHighScore: integer("tetris_high_score").notNull().default(0),
    totalGameEarnings: integer("total_game_earnings").notNull().default(0),
    gamesPlayed: integer("games_played").notNull().default(0),
    totalLinesCleared: integer("total_lines_cleared").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Reward amounts configuration (in IDR)
export const GAME_REWARD_AMOUNTS = {
    SINGLE_LINE: 50,      // 1 line
    DOUBLE_LINE: 150,     // 2 lines (1.5x multiplier)
    TRIPLE_LINE: 300,     // 3 lines (2x multiplier)
    TETRIS: 600,          // 4 lines (3x multiplier)
    COMBO_BONUS: 0.10,    // +10% per combo
};

// Helper function to calculate reward
export function calculateLineReward(linesCleared: number, comboCount: number = 0): number {
    let baseReward = 0;

    switch (linesCleared) {
        case 1:
            baseReward = GAME_REWARD_AMOUNTS.SINGLE_LINE;
            break;
        case 2:
            baseReward = GAME_REWARD_AMOUNTS.DOUBLE_LINE;
            break;
        case 3:
            baseReward = GAME_REWARD_AMOUNTS.TRIPLE_LINE;
            break;
        case 4:
            baseReward = GAME_REWARD_AMOUNTS.TETRIS;
            break;
        default:
            baseReward = 0;
    }

    // Apply combo bonus (+10% per combo)
    const comboMultiplier = 1 + (comboCount * GAME_REWARD_AMOUNTS.COMBO_BONUS);
    return Math.floor(baseReward * comboMultiplier);
}
