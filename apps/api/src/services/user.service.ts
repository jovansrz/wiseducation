import { db } from "../db/index.js";
import { user } from "../db/schema/auth.js";
import { eq } from "drizzle-orm";

export const userService = {
    async getUserById(id: string) {
        const [foundUser] = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                createdAt: user.createdAt,
            })
            .from(user)
            .where(eq(user.id, id))
            .limit(1);

        return foundUser;
    },

    async updateUser(id: string, data: Partial<typeof user.$inferSelect>) {
        const [updatedUser] = await db
            .update(user)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(user.id, id))
            .returning();

        return updatedUser;
    }
};
