import { db } from "../db/index.js";
import { activity } from "../db/schema/activity.js";
import { eq, desc } from "drizzle-orm";

export const activityService = {
    async getRecentActivities(userId: string) {
        return await db
            .select()
            .from(activity)
            .where(eq(activity.userId, userId))
            .orderBy(desc(activity.createdAt))
            .limit(10);
    },

    async logActivity(userId: string, type: string, description: string, metadata?: any) {
        return await db
            .insert(activity)
            .values({
                id: crypto.randomUUID(),
                userId,
                type,
                description,
                metadata
            })
            .returning();
    }
};
