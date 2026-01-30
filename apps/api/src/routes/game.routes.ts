import { Router, Request, Response } from "express";
import { gameService } from "../services/game.service.js";

const router = Router();

// Submit game score
router.post("/score", async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "User ID required" });
        }

        const { score, linesCleared, cashEarned, comboCount, maxCombo, duration, gameType } = req.body;

        if (score === undefined || linesCleared === undefined) {
            return res.status(400).json({ error: "Score and linesCleared are required" });
        }

        const result = await gameService.submitGameScore(userId, {
            score,
            linesCleared,
            cashEarned: cashEarned || 0,
            comboCount: comboCount || 0,
            maxCombo: maxCombo || 0,
            duration: duration || 0,
            gameType: gameType || "tetris",
        });

        return res.json(result);
    } catch (error) {
        console.error("Error submitting game score:", error);
        return res.status(500).json({ error: "Failed to submit game score" });
    }
});

// Get leaderboard
router.get("/leaderboard/:gameType?", async (req: Request, res: Response) => {
    try {
        const gameType = req.params.gameType || "tetris";
        const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '10';
        const limit = parseInt(limitStr) || 10;

        const leaderboard = await gameService.getLeaderboard(gameType, limit);
        return res.json(leaderboard);
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
});

// Get user game stats
router.get("/stats", async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "User ID required" });
        }

        const stats = await gameService.getUserGameStats(userId);
        return res.json(stats);
    } catch (error) {
        console.error("Error fetching user game stats:", error);
        return res.status(500).json({ error: "Failed to fetch user game stats" });
    }
});

// Get user's best scores
router.get("/best/:gameType?", async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "User ID required" });
        }

        const gameType = req.params.gameType || "tetris";
        const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '5';
        const limit = parseInt(limitStr) || 5;

        const scores = await gameService.getUserBestScores(userId, gameType, limit);
        return res.json(scores);
    } catch (error) {
        console.error("Error fetching best scores:", error);
        return res.status(500).json({ error: "Failed to fetch best scores" });
    }
});

// Get user's recent games
router.get("/recent", async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "User ID required" });
        }

        const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '10';
        const limit = parseInt(limitStr) || 10;
        const games = await gameService.getUserRecentGames(userId, limit);
        return res.json(games);
    } catch (error) {
        console.error("Error fetching recent games:", error);
        return res.status(500).json({ error: "Failed to fetch recent games" });
    }
});

// Get transaction history
router.get("/transactions", async (req: Request, res: Response) => {
    try {
        const userId = req.headers["x-user-id"] as string;
        if (!userId) {
            return res.status(401).json({ error: "User ID required" });
        }

        const limitStr = typeof req.query.limit === 'string' ? req.query.limit : '20';
        const limit = parseInt(limitStr) || 20;
        const transactions = await gameService.getTransactionHistory(userId, limit);
        return res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

export default router;
