import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import routes from "./routes/index.js";

const app = express();
const port = process.env.PORT || 3005;

// CORS Configuration
app.use(
    cors({
        origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:3005"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Better Auth Handler (Must be before express.json)
app.all("/api/auth/*", toNodeHandler(auth));

// Middleware
app.use(express.json());

// API Routes
app.use("/api", routes);

// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Better Auth URL: ${process.env.BETTER_AUTH_URL}/api/auth`);
});
