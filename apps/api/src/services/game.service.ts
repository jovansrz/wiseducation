import { db } from "../db/index.js";
import { gameScore, virtualTransaction, userGameStats, calculateLineReward } from "../db/schema/game.js";
import { eq, desc, and } from "drizzle-orm";

export const gameService = {
    // Get or create user game stats
    async getUserGameStats(userId: string) {
        let [stats] = await db
            .select()
            .from(userGameStats)
            .where(eq(userGameStats.userId, userId))
            .limit(1);

        if (!stats) {
            [stats] = await db
                .insert(userGameStats)
                .values({
                    id: crypto.randomUUID(),
                    userId,
                    virtualBalance: 10000000, // 10M IDR initial
                    tetrisHighScore: 0,
                    totalGameEarnings: 0,
                    gamesPlayed: 0,
                    totalLinesCleared: 0,
                })
                .returning();
        }

        return stats;
    },

    // Submit a game score and calculate rewards
    async submitGameScore(
        userId: string,
        data: {
            score: number;
            linesCleared: number;
            cashEarned: number;
            comboCount: number;
            maxCombo: number;
            duration: number;
            gameType?: string;
        }
    ) {
        const gameType = data.gameType || "tetris";

        // 1. Insert game score
        const scoreId = crypto.randomUUID();
        const [newScore] = await db
            .insert(gameScore)
            .values({
                id: scoreId,
                userId,
                gameType,
                score: data.score,
                linesCleared: data.linesCleared,
                cashEarned: data.cashEarned,
                comboCount: data.comboCount,
                maxCombo: data.maxCombo,
                duration: data.duration,
            })
            .returning();

        // 2. Record virtual transaction for reward
        if (data.cashEarned > 0) {
            await db.insert(virtualTransaction).values({
                id: crypto.randomUUID(),
                userId,
                type: "GAME_REWARD",
                amount: data.cashEarned,
                description: `Tetris game reward - ${data.linesCleared} lines cleared`,
                metadata: JSON.stringify({
                    gameScoreId: scoreId,
                    lines: data.linesCleared,
                    maxCombo: data.maxCombo,
                    score: data.score,
                }),
            });
        }

        // 3. Update user game stats
        const stats = await this.getUserGameStats(userId);
        const isNewHighScore = data.score > stats.tetrisHighScore;

        await db
            .update(userGameStats)
            .set({
                virtualBalance: stats.virtualBalance + data.cashEarned,
                tetrisHighScore: isNewHighScore ? data.score : stats.tetrisHighScore,
                totalGameEarnings: stats.totalGameEarnings + data.cashEarned,
                gamesPlayed: stats.gamesPlayed + 1,
                totalLinesCleared: stats.totalLinesCleared + data.linesCleared,
                updatedAt: new Date(),
            })
            .where(eq(userGameStats.id, stats.id));

        return {
            success: true,
            gameScore: newScore,
            cashEarned: data.cashEarned,
            isNewHighScore,
            newBalance: stats.virtualBalance + data.cashEarned,
        };
    },

    // Get leaderboard for a specific game type
    async getLeaderboard(gameType: string = "tetris", limit: number = 10) {
        const scores = await db
            .select({
                id: gameScore.id,
                userId: gameScore.userId,
                score: gameScore.score,
                linesCleared: gameScore.linesCleared,
                cashEarned: gameScore.cashEarned,
                maxCombo: gameScore.maxCombo,
                playedAt: gameScore.playedAt,
            })
            .from(gameScore)
            .where(eq(gameScore.gameType, gameType))
            .orderBy(desc(gameScore.score))
            .limit(limit);

        return scores;
    },

    // Get user's best scores
    async getUserBestScores(userId: string, gameType: string = "tetris", limit: number = 5) {
        const scores = await db
            .select()
            .from(gameScore)
            .where(and(eq(gameScore.userId, userId), eq(gameScore.gameType, gameType)))
            .orderBy(desc(gameScore.score))
            .limit(limit);

        return scores;
    },

    // Get user's recent games
    async getUserRecentGames(userId: string, limit: number = 10) {
        const scores = await db
            .select()
            .from(gameScore)
            .where(eq(gameScore.userId, userId))
            .orderBy(desc(gameScore.playedAt))
            .limit(limit);

        return scores;
    },

    // Get virtual transaction history
    async getTransactionHistory(userId: string, limit: number = 20) {
        const transactions = await db
            .select()
            .from(virtualTransaction)
            .where(eq(virtualTransaction.userId, userId))
            .orderBy(desc(virtualTransaction.createdAt))
            .limit(limit);

        return transactions;
    },

    // Calculate reward helper (exposed for frontend preview)
    calculateReward(linesCleared: number, comboCount: number = 0): number {
        return calculateLineReward(linesCleared, comboCount);
    },
};
