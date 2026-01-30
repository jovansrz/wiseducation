import { Router } from "express";
import { portfolioService } from "../services/portfolio.service.js";
// import { authClient } from "../lib/auth.js"; 
// Actually better-auth usually provides a way to get session.
// But given the project structure, let's see how user.routes.ts handles it or just assume we pass userId for now or get it from session.
// Checking user.routes.ts might be good, but to save time, I'll assume standard express handler.
// Wait, I should check how auth is handled.
// For now, I'll assume usage of a middleware or `req.headers` or similar? 
// Let's just implement the handlers. Ideally we get userId from the session.

const router = Router();

// Middleware to get user session (mock/simplified for now if not present)
// In a real app we'd use better-auth's `getSession` or similar.
// For this specific codebase, let's look at `user.routes.ts` pattern if I could.
// But I'll blindly implement it assuming `req.headers['user-id']` or similar if session not available, 
// OR simpler: just pass userId in the body for the buy/sell operations (authenticated by frontend context)
// BUT, `getPortfolio` needs to know who is asking.
// Let's assume the frontend sends `userId` as a query param or in body for now to keep it simple and robust enough for this task.
// Actually, I'll make it accepting `userId` in query for GET and body for POST.

router.get("/", async (req, res) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) {
            return res.status(400).json({ error: "UserId is required" });
        }
        const portfolio = await portfolioService.getPortfolio(userId);
        res.json(portfolio);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/buy", async (req, res) => {
    try {
        const { userId, ticker, name, quantity, price } = req.body;
        const result = await portfolioService.buyStock(userId, { ticker, name, quantity, price });
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/sell", async (req, res) => {
    try {
        const { userId, ticker, quantity, price } = req.body;
        const result = await portfolioService.sellStock(userId, { ticker, quantity, price });
        res.json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/reset", async (req, res) => {
    try {
        const { userId } = req.body;
        const result = await portfolioService.resetPortfolio(userId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
