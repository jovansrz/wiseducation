import { db } from "../db/index.js";
import { gameScore, gameStats } from "../db/schema/game.js";
import { portfolio } from "../db/schema/portfolio.js";
import { eq, desc, and } from "drizzle-orm";

// Reward configuration
const REWARDS = {
    tetris: {
        perLine: 500,           // 500 WISE Cash per line
        tetrisBonus: 2,         // 2x multiplier for 4-line clear (Tetris)
        tSpinBonus: 1.5,        // 1.5x for T-spins
    },
    wiseJump: {
        perCoin: 1000,          // 1000 WISE Cash per regular coin
        specialCoin: 5000,      // 5000 per special coin
        distanceBonus: 100,     // 100 per 100m distance
    }
};

export const gameService = {
    // Submit a game score and earn WISE Cash
    async submitScore(userId: string, data: {
        gameType: 'tetris' | 'wise_jump';
        score: number;
        linesCleared?: number;
        coinsCollected?: number;
        specialCoins?: number;
        distance?: number;
    }) {
        // Calculate WISE Cash earned
        let wiseCashEarned = 0;

        if (data.gameType === 'tetris') {
            // Tetris: based on lines cleared
            wiseCashEarned = (data.linesCleared || 0) * REWARDS.tetris.perLine;
            // Add bonus for score tiers (combo/t-spin bonuses already reflected in line count)
            if (data.score > 10000) wiseCashEarned += 5000;
            if (data.score > 50000) wiseCashEarned += 10000;
            if (data.score > 100000) wiseCashEarned += 25000;
        } else if (data.gameType === 'wise_jump') {
            // Wise Jump: based on coins + distance
            const regularCoins = (data.coinsCollected || 0) - (data.specialCoins || 0);
            wiseCashEarned = regularCoins * REWARDS.wiseJump.perCoin;
            wiseCashEarned += (data.specialCoins || 0) * REWARDS.wiseJump.specialCoin;
            wiseCashEarned += Math.floor((data.distance || 0) / 100) * REWARDS.wiseJump.distanceBonus;
        }

        // 1. Record the game score
        const scoreId = `gs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await db.insert(gameScore).values({
            id: scoreId,
            userId,
            gameType: data.gameType,
            score: data.score,
            linesCleared: data.linesCleared,
            coinsCollected: data.coinsCollected,
            distance: data.distance,
            wiseCashEarned,
        });

        // 2. Update or create user stats
        const [existingStats] = await db
            .select()
            .from(gameStats)
            .where(eq(gameStats.userId, userId))
            .limit(1);

        if (existingStats) {
            const updates: any = {
                totalWiseCashEarned: existingStats.totalWiseCashEarned + wiseCashEarned,
                updatedAt: new Date(),
            };

            if (data.gameType === 'tetris') {
                updates.tetrisGamesPlayed = existingStats.tetrisGamesPlayed + 1;
                updates.tetrisTotalLinesCleared = existingStats.tetrisTotalLinesCleared + (data.linesCleared || 0);
                if (data.score > existingStats.tetrisHighScore) {
                    updates.tetrisHighScore = data.score;
                }
            } else {
                updates.wiseJumpGamesPlayed = existingStats.wiseJumpGamesPlayed + 1;
                updates.wiseJumpTotalCoins = existingStats.wiseJumpTotalCoins + (data.coinsCollected || 0);
                if (data.score > existingStats.wiseJumpHighScore) {
                    updates.wiseJumpHighScore = data.score;
                }
                if ((data.distance || 0) > existingStats.wiseJumpBestDistance) {
                    updates.wiseJumpBestDistance = data.distance || 0;
                }
            }

            await db.update(gameStats)
                .set(updates)
                .where(eq(gameStats.id, existingStats.id));
        } else {
            // Create new stats record
            await db.insert(gameStats).values({
                id: `gstats_${userId}`,
                userId,
                tetrisHighScore: data.gameType === 'tetris' ? data.score : 0,
                tetrisGamesPlayed: data.gameType === 'tetris' ? 1 : 0,
                tetrisTotalLinesCleared: data.linesCleared || 0,
                wiseJumpHighScore: data.gameType === 'wise_jump' ? data.score : 0,
                wiseJumpGamesPlayed: data.gameType === 'wise_jump' ? 1 : 0,
                wiseJumpTotalCoins: data.coinsCollected || 0,
                wiseJumpBestDistance: data.distance || 0,
                totalWiseCashEarned: wiseCashEarned,
            });
        }

        // 3. Add WISE Cash to user's portfolio balance
        const [userPortfolio] = await db
            .select()
            .from(portfolio)
            .where(eq(portfolio.userId, userId))
            .limit(1);

        if (userPortfolio) {
            await db.update(portfolio)
                .set({
                    balance: userPortfolio.balance + wiseCashEarned,
                    updatedAt: new Date()
                })
                .where(eq(portfolio.id, userPortfolio.id));
        } else {
            // Create portfolio if doesn't exist (new user playing games first)
            await db.insert(portfolio).values({
                id: crypto.randomUUID(),
                userId,
                balance: 10000000 + wiseCashEarned, // Starting balance + earnings
            });
        }

        return {
            success: true,
            scoreId,
            wiseCashEarned,
            message: `Earned ${wiseCashEarned.toLocaleString()} WISE Cash!`
        };
    },

    // Get leaderboard for a specific game type
    async getLeaderboard(gameType: 'tetris' | 'wise_jump', limit = 10) {
        if (gameType === 'tetris') {
            return await db
                .select({
                    rank: gameStats.id, // Will be calculated client-side
                    userId: gameStats.userId,
                    highScore: gameStats.tetrisHighScore,
                    gamesPlayed: gameStats.tetrisGamesPlayed,
                    totalLinesCleared: gameStats.tetrisTotalLinesCleared,
                })
                .from(gameStats)
                .orderBy(desc(gameStats.tetrisHighScore))
                .limit(limit);
        } else {
            return await db
                .select({
                    rank: gameStats.id,
                    userId: gameStats.userId,
                    highScore: gameStats.wiseJumpHighScore,
                    gamesPlayed: gameStats.wiseJumpGamesPlayed,
                    bestDistance: gameStats.wiseJumpBestDistance,
                    totalCoins: gameStats.wiseJumpTotalCoins,
                })
                .from(gameStats)
                .orderBy(desc(gameStats.wiseJumpHighScore))
                .limit(limit);
        }
    },

    // Get user's game stats
    async getUserStats(userId: string) {
        const [stats] = await db
            .select()
            .from(gameStats)
            .where(eq(gameStats.userId, userId))
            .limit(1);

        if (!stats) {
            return {
                tetrisHighScore: 0,
                tetrisGamesPlayed: 0,
                tetrisTotalLinesCleared: 0,
                wiseJumpHighScore: 0,
                wiseJumpGamesPlayed: 0,
                wiseJumpTotalCoins: 0,
                wiseJumpBestDistance: 0,
                totalWiseCashEarned: 0,
            };
        }

        return stats;
    },

    // Get recent games for a user
    async getRecentGames(userId: string, limit = 10) {
        return await db
            .select()
            .from(gameScore)
            .where(eq(gameScore.userId, userId))
            .orderBy(desc(gameScore.playedAt))
            .limit(limit);
    }
};
