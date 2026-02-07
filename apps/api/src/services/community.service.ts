import { db } from "../db/index.js";
import { post, comment, vote, user } from "../db/schema/index.js";
import { eq, desc, and } from "drizzle-orm";

export const communityService = {
    async getPosts() {
        return await db
            .select({
                id: post.id,
                content: post.content,
                type: post.type,
                imageUrl: post.imageUrl,
                pollOptions: post.pollOptions,
                tags: post.tags,
                upvotes: post.upvotes,
                downvotes: post.downvotes,
                commentCount: post.commentCount,
                createdAt: post.createdAt,
                author: {
                    id: user.id,
                    name: user.name,
                    image: user.image
                }
            })
            .from(post)
            .innerJoin(user, eq(post.authorId, user.id))
            .orderBy(desc(post.createdAt));
    },

    async getPostById(postId: string) {
        const [postResult] = await db
            .select({
                id: post.id,
                content: post.content,
                type: post.type,
                imageUrl: post.imageUrl,
                pollOptions: post.pollOptions,
                tags: post.tags,
                upvotes: post.upvotes,
                downvotes: post.downvotes,
                commentCount: post.commentCount,
                createdAt: post.createdAt,
                author: {
                    id: user.id,
                    name: user.name,
                    image: user.image
                }
            })
            .from(post)
            .innerJoin(user, eq(post.authorId, user.id))
            .where(eq(post.id, postId));

        if (!postResult) return null;

        // Get comments for this post
        const comments = await db
            .select({
                id: comment.id,
                content: comment.content,
                parentId: comment.parentId,
                createdAt: comment.createdAt,
                author: {
                    id: user.id,
                    name: user.name,
                    image: user.image
                }
            })
            .from(comment)
            .innerJoin(user, eq(comment.authorId, user.id))
            .where(eq(comment.postId, postId))
            .orderBy(desc(comment.createdAt));

        return { ...postResult, comments };
    },

    async createPost(userId: string, data: { content: string; type?: string; imageUrl?: string; pollOptions?: any; tags?: string[] }) {
        return await db
            .insert(post)
            .values({
                id: crypto.randomUUID(),
                authorId: userId,
                content: data.content,
                type: data.type || "text",
                imageUrl: data.imageUrl,
                pollOptions: data.pollOptions,
                tags: data.tags || []
            })
            .returning();
    },

    async createComment(userId: string, postId: string, content: string, parentId?: string) {
        const newComment = await db
            .insert(comment)
            .values({
                id: crypto.randomUUID(),
                postId,
                authorId: userId,
                content,
                parentId: parentId || null
            })
            .returning();

        // Increment comment count on post
        await db
            .update(post)
            .set({
                commentCount: db.$count(comment, eq(comment.postId, postId))
            })
            .where(eq(post.id, postId));

        return newComment[0];
    },

    async votePost(userId: string, postId: string, direction: number) {
        // Check for existing vote
        const [existingVote] = await db
            .select()
            .from(vote)
            .where(and(eq(vote.postId, postId), eq(vote.userId, userId)));

        if (existingVote) {
            if (existingVote.direction === direction) {
                // Same vote - remove it (toggle off)
                await db.delete(vote).where(eq(vote.id, existingVote.id));

                // Update post counts
                if (direction === 1) {
                    await db.update(post)
                        .set({ upvotes: post.upvotes })
                        .where(eq(post.id, postId));
                }

                return { action: "removed", direction: 0 };
            } else {
                // Different vote - update it
                await db.update(vote)
                    .set({ direction })
                    .where(eq(vote.id, existingVote.id));

                return { action: "changed", direction };
            }
        }

        // No existing vote - create new one
        await db.insert(vote).values({
            id: crypto.randomUUID(),
            postId,
            userId,
            direction
        });

        return { action: "created", direction };
    },

    async getUserVoteForPost(userId: string, postId: string) {
        const [existingVote] = await db
            .select({ direction: vote.direction })
            .from(vote)
            .where(and(eq(vote.postId, postId), eq(vote.userId, userId)));

        return existingVote?.direction || 0;
    },

    async deletePost(userId: string, postId: string) {
        // First verify ownership
        const [postToDelete] = await db
            .select({ authorId: post.authorId })
            .from(post)
            .where(eq(post.id, postId));

        if (!postToDelete || postToDelete.authorId !== userId) {
            throw new Error("Unauthorized to delete this post");
        }

        // Delete associated votes and comments first
        await db.delete(vote).where(eq(vote.postId, postId));
        await db.delete(comment).where(eq(comment.postId, postId));
        await db.delete(post).where(eq(post.id, postId));

        return { success: true };
    },

    async getTopContributors() {
        // Get users with most posts
        return await db
            .select({
                id: user.id,
                name: user.name,
                image: user.image,
            })
            .from(user)
            .limit(5);
    },

    async recalculatePostVotes(postId: string) {
        // Get all votes for post
        const votes = await db
            .select({ direction: vote.direction })
            .from(vote)
            .where(eq(vote.postId, postId));

        const upvotes = votes.filter(v => v.direction === 1).length;
        const downvotes = votes.filter(v => v.direction === -1).length;

        await db.update(post)
            .set({ upvotes, downvotes })
            .where(eq(post.id, postId));

        return { upvotes, downvotes };
    }
};
