import { Router } from "express";
import { mentoringService } from "../services/mentoring.service.js";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

const router = Router();

// Middleware to get session
const requireAuth = async (req: any, res: any, next: any) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });

        if (!session) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        req.user = session.user;
        next();
    } catch (error) {
        res.status(500).json({ error: "Auth error" });
    }
};

router.post("/book", requireAuth, async (req: any, res) => {
    try {
        const { mentorId, mentorName, price } = req.body;
        const thread = await mentoringService.bookMentor(req.user.id, mentorId, mentorName, price);
        res.json(thread);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.get("/threads", requireAuth, async (req: any, res) => {
    try {
        const threads = await mentoringService.getThreads(req.user.id);
        res.json(threads);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/thread/:threadId/messages", requireAuth, async (req: any, res) => {
    try {
        const messages = await mentoringService.getMessages(req.params.threadId, req.user.id);
        res.json(messages);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/thread/:threadId/messages", requireAuth, async (req: any, res) => {
    try {
        const { content } = req.body;
        const message = await mentoringService.sendMessage(req.params.threadId, req.user.id, content);
        res.json(message);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
