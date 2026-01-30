import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import { user, session, account, verification } from "../db/schema/auth.js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user,
            session,
            account,
            verification
        }
    }),
    emailAndPassword: {
        enabled: true,
    },
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:3005"],
});
