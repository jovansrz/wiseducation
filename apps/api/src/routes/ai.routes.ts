import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { aiService } from "../services/ai.service.js";

const router = Router();

router.post("/chat", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const { message, context, threadId } = req.body;

    if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
    }

    try {
        const response = await aiService.chat(userId, message, threadId);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to process chat message" });
    }
});

router.get("/threads", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const threads = await aiService.getThreads(userId);
    res.json(threads);
});


router.get("/threads/:threadId", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const { threadId } = req.params;

    if (typeof threadId !== 'string') {
        res.status(400).json({ message: "Invalid thread ID" });
        return;
    }

    const messages = await aiService.getThreadMessages(threadId, userId);

    if (!messages) {
        res.status(404).json({ message: "Thread not found" });
        return;
    }

    res.json(messages);
});

router.post("/threads", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const thread = await aiService.createThread(userId);
    res.json(thread);
});

router.delete("/threads/:threadId", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const { threadId } = req.params;

    if (typeof threadId !== 'string') {
        res.status(400).json({ message: "Invalid thread ID" });
        return;
    }

    await aiService.deleteThread(threadId, userId);
    res.json({ message: "Thread deleted" });
});

export default router;
