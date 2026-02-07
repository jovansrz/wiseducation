import { Router } from "express";
import { gameService } from "../services/game.service.js";

const router = Router();

// Submit game score and earn WISE Cash
router.post("/submit-score", async (req, res) => {
    try {
        const { userId, gameType, score, linesCleared, coinsCollected, specialCoins, distance } = req.body;

        if (!userId || !gameType || score === undefined) {
            return res.status(400).json({ error: "userId, gameType, and score are required" });
        }

        if (!['tetris', 'wise_jump'].includes(gameType)) {
            return res.status(400).json({ error: "Invalid game type. Must be 'tetris' or 'wise_jump'" });
        }

        const result = await gameService.submitScore(userId, {
            gameType,
            score,
            linesCleared,
            coinsCollected,
            specialCoins,
            distance,
        });

        res.json(result);
    } catch (error: any) {
        console.error("Error submitting game score:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get leaderboard for a game type
router.get("/leaderboard/:gameType", async (req, res) => {
    try {
        const { gameType } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!['tetris', 'wise_jump'].includes(gameType)) {
            return res.status(400).json({ error: "Invalid game type" });
        }

        const leaderboard = await gameService.getLeaderboard(gameType as 'tetris' | 'wise_jump', limit);

        // Add rank numbers
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1,
        }));

        res.json(rankedLeaderboard);
    } catch (error: any) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's game stats
router.get("/stats/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const stats = await gameService.getUserStats(userId);
        res.json(stats);
    } catch (error: any) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's recent games
router.get("/history/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;
        const games = await gameService.getRecentGames(userId, limit);
        res.json(games);
    } catch (error: any) {
        console.error("Error fetching game history:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
