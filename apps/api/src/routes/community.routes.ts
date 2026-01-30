import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { communityService } from "../services/community.service.js";

const router = Router();

router.get("/posts", async (req, res) => {
    const posts = await communityService.getPosts();
    res.json(posts);
});

router.post("/posts", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const { content, type, imageUrl, pollOptions } = req.body;

    if (!content) {
        res.status(400).json({ message: "Content is required" });
        return;
    }

    const newPost = await communityService.createPost(userId, {
        content,
        type,
        imageUrl,
        pollOptions
    });

    res.status(201).json(newPost);
});

router.get("/contributors", async (req, res) => {
    const users = await communityService.getTopContributors();
    res.json(users);
});

export default router;
