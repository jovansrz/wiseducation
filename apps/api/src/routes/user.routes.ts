import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { portfolioService } from "../services/portfolio.service.js";
import { activityService } from "../services/activity.service.js";
import { userService } from "../services/user.service.js";

const router = Router();

// Get current user profile (protected is redundant if we trust session, but good practice)
router.get("/me", authMiddleware, async (req, res) => {
    // @ts-ignore
    const user = req.user;
    // Refresh data from DB to get latest
    const userData = await userService.getUserById(user.id);
    res.json(userData);
});

router.get("/portfolio", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const portfolio = await portfolioService.getPortfolio(userId);
    res.json(portfolio);
});

router.get("/portfolio/history", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const history = await portfolioService.getPortfolioHistory(userId);
    res.json(history);
});

router.get("/activities", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const activities = await activityService.getRecentActivities(userId);
    res.json(activities);
});

export default router;
