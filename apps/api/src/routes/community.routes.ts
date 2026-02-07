import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { communityService } from "../services/community.service.js";

const router = Router();

// Get all posts
router.get("/posts", async (req, res) => {
    try {
        const posts = await communityService.getPosts();
        res.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});

// Get single post with comments
router.get("/posts/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await communityService.getPostById(id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Failed to fetch post" });
    }
});

// Create new post (authenticated)
router.post("/posts", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { content, type, imageUrl, pollOptions, tags } = req.body;

        if (!content) {
            res.status(400).json({ message: "Content is required" });
            return;
        }

        const newPost = await communityService.createPost(userId, {
            content,
            type,
            imageUrl,
            pollOptions,
            tags
        });

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post" });
    }
});

// Add comment to post (authenticated)
router.post("/posts/:id/comments", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const id = req.params.id as string;
        const { content, parentId } = req.body;

        if (!content) {
            res.status(400).json({ message: "Comment content is required" });
            return;
        }

        const comment = await communityService.createComment(userId, id, content, parentId);
        res.status(201).json(comment);
    } catch (error) {
        console.error("Error creating comment:", error);
        res.status(500).json({ message: "Failed to create comment" });
    }
});

// Vote on post (authenticated)
router.post("/posts/:id/vote", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const id = req.params.id as string;
        const { direction } = req.body; // 1 for upvote, -1 for downvote

        if (direction !== 1 && direction !== -1) {
            res.status(400).json({ message: "Direction must be 1 or -1" });
            return;
        }

        const result = await communityService.votePost(userId, id, direction);

        // Recalculate vote counts after voting
        const votes = await communityService.recalculatePostVotes(id);

        res.json({ ...result, ...votes });
    } catch (error) {
        console.error("Error voting on post:", error);
        res.status(500).json({ message: "Failed to vote on post" });
    }
});

// Delete post (authenticated, owner only)
router.delete("/posts/:id", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const id = req.params.id as string;

        await communityService.deletePost(userId, id);
        res.status(204).send();
    } catch (error: any) {
        console.error("Error deleting post:", error);
        if (error.message === "Unauthorized to delete this post") {
            res.status(403).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Failed to delete post" });
        }
    }
});

// Get top contributors
router.get("/contributors", async (req, res) => {
    try {
        const users = await communityService.getTopContributors();
        res.json(users);
    } catch (error) {
        console.error("Error fetching contributors:", error);
        res.status(500).json({ message: "Failed to fetch contributors" });
    }
});

export default router;
