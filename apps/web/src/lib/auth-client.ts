import { createAuthClient } from "better-auth/react";

// In development, usage of localhost is fine. 
// In production (Vercel), we default to valid origin if env var is missing.
const baseURL = import.meta.env.VITE_AUTH_URL || (import.meta.env.DEV ? "http://localhost:3005" : window.location.origin);

export const authClient = createAuthClient({
    baseURL
});
