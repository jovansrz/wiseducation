import { Router } from "express";
import userRoutes from "./user.routes.js";
import marketRoutes from "./market.routes.js";
import educationRoutes from "./education.routes.js";
import communityRoutes from "./community.routes.js";
import aiRoutes from "./ai.routes.js";
import portfolioRoutes from "./portfolio.routes.js";
import gameRoutes from "./game.routes.js";

const router = Router();

router.use("/user", userRoutes);
router.use("/market", marketRoutes);
router.use("/education", educationRoutes);
router.use("/community", communityRoutes);
router.use("/ai", aiRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/game", gameRoutes);

export default router;
