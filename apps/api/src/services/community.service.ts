import { db } from "../db/index.js";
import { post, user } from "../db/schema/index.js";
import { eq, desc } from "drizzle-orm";

export const communityService = {
    async getPosts() {
        return await db
            .select({
                id: post.id,
                content: post.content,
                type: post.type,
                imageUrl: post.imageUrl,
                pollOptions: post.pollOptions,
                upvotes: post.upvotes,
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

    async createPost(userId: string, data: { content: string; type?: string; imageUrl?: string; pollOptions?: any }) {
        return await db
            .insert(post)
            .values({
                id: crypto.randomUUID(),
                authorId: userId,
                content: data.content,
                type: data.type || "text",
                imageUrl: data.imageUrl,
                pollOptions: data.pollOptions
            })
            .returning();
    },

    async getTopContributors() {
        // Mock logic for now, in reality would aggregate votes/posts
        return await db
            .select({
                id: user.id,
                name: user.name,
                image: user.image,
                // reputation: ...
            })
            .from(user)
            .limit(5);
    }
};
