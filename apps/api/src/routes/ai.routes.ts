import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { aiService } from "../services/ai.service.js";

const router = Router();

router.post("/chat", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const { message, context } = req.body;

    if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
    }

    const response = await aiService.chat(userId, message, context);
    res.json(response);
});

export default router;
