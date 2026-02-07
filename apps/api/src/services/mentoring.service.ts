import { db } from "../db/index.js";
import { mentorThreads, mentorMessages, messageSenderEnum } from "../db/schema/mentor.js";
import { portfolio } from "../db/schema/portfolio.js";
import { eq, desc, and } from "drizzle-orm";

export const mentoringService = {
    async bookMentor(userId: string, mentorId: string, mentorName: string, price: number) {
        return await db.transaction(async (tx: any) => {
            // 1. Check user balance from portfolio
            const userPortfolio = await tx.query.portfolio.findFirst({
                where: eq(portfolio.userId, userId),
            });

            const currentBalance = userPortfolio?.balance || 0;

            if (currentBalance < price) {
                throw new Error("Insufficient WISE Cash balance");
            }

            // 2. Deduct balance from portfolio
            await tx
                .update(portfolio)
                .set({ balance: currentBalance - price, updatedAt: new Date() })
                .where(eq(portfolio.userId, userId));

            // 3. Create thread
            const [thread] = await tx
                .insert(mentorThreads)
                .values({
                    userId,
                    mentorId,
                    mentorName,
                })
                .returning();

            // 4. Send welcome message
            await tx.insert(mentorMessages).values({
                threadId: thread.id,
                sender: "mentor",
                content: `Hello! I'm ${mentorName}. Thanks for booking a session. How can I help you with your investment journey today?`,
            });

            return thread;
        });
    },

    async getThreads(userId: string) {
        return await db.query.mentorThreads.findMany({
            where: eq(mentorThreads.userId, userId),
            orderBy: [desc(mentorThreads.updatedAt)],
        });
    },

    async getMessages(threadId: string, userId: string) {
        // Verify ownership
        const thread = await db.query.mentorThreads.findFirst({
            where: and(eq(mentorThreads.id, threadId), eq(mentorThreads.userId, userId)),
        });

        if (!thread) {
            throw new Error("Thread not found or unauthorized");
        }

        return await db.query.mentorMessages.findMany({
            where: eq(mentorMessages.threadId, threadId),
            orderBy: [desc(mentorMessages.createdAt)], // Newest first for chat UI usually, or Oldest first depending on UI
        });
    },

    async sendMessage(threadId: string, userId: string, content: string) {
        // Verify ownership
        const thread = await db.query.mentorThreads.findFirst({
            where: and(eq(mentorThreads.id, threadId), eq(mentorThreads.userId, userId)),
        });

        if (!thread) {
            throw new Error("Thread not found or unauthorized");
        }

        const [message] = await db
            .insert(mentorMessages)
            .values({
                threadId,
                sender: "user",
                content,
            })
            .returning();

        // Update thread updated_at
        await db
            .update(mentorThreads)
            .set({ updatedAt: new Date() })
            .where(eq(mentorThreads.id, threadId));

        return message;
    },
};
