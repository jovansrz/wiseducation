import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { educationService } from "../services/education.service.js";

const router = Router();

// ==================== COURSE ENDPOINTS ====================

// GET /courses - Get all courses (optional difficulty filter)
router.get("/courses", async (req, res) => {
    try {
        const difficulty = req.query.difficulty as string | undefined;
        const courses = await educationService.getCourses({ difficulty });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});

// GET /courses/with-progress - Get courses with user progress (requires auth)
router.get("/courses/with-progress", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const difficulty = req.query.difficulty as string | undefined;
        const courses = await educationService.getCoursesWithProgress(userId, { difficulty });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses with progress:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});

// GET /courses/level/:level - Get courses by difficulty level
router.get("/courses/level/:level", async (req, res) => {
    try {
        const level = req.params.level;
        if (!["Beginner", "Intermediate", "Advanced"].includes(level)) {
            res.status(400).json({ message: "Invalid level. Must be Beginner, Intermediate, or Advanced" });
            return;
        }
        const courses = await educationService.getCourses({ difficulty: level });
        res.json(courses);
    } catch (error) {
        console.error("Error fetching courses by level:", error);
        res.status(500).json({ message: "Failed to fetch courses" });
    }
});

// GET /courses/:id - Get single course with lessons
router.get("/courses/:id", async (req, res) => {
    try {
        const course = await educationService.getCourseWithLessons(req.params.id);
        if (!course) {
            res.status(404).json({ message: "Course not found" });
            return;
        }
        res.json(course);
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ message: "Failed to fetch course" });
    }
});

// GET /courses/:id/lessons - Get lessons for a course
router.get("/courses/:id/lessons", async (req, res) => {
    try {
        const lessons = await educationService.getLessonsByCourseid(req.params.id);
        res.json(lessons);
    } catch (error) {
        console.error("Error fetching lessons:", error);
        res.status(500).json({ message: "Failed to fetch lessons" });
    }
});

// GET /courses/:id/lessons/with-progress - Get lessons with progress (requires auth)
router.get("/courses/:id/lessons/with-progress", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const lessons = await educationService.getLessonsWithProgress(userId, req.params.id as string);
        res.json(lessons);
    } catch (error) {
        console.error("Error fetching lessons with progress:", error);
        res.status(500).json({ message: "Failed to fetch lessons" });
    }
});

// GET /courses/:id/progress - Get user's course progress
router.get("/courses/:id/progress", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const progress = await educationService.getUserCourseProgress(userId, req.params.id as string);
        res.json(progress || { progress: 0, completed: false });
    } catch (error) {
        console.error("Error fetching course progress:", error);
        res.status(500).json({ message: "Failed to fetch progress" });
    }
});

// ==================== LESSON ENDPOINTS ====================

// GET /lessons/:id - Get single lesson
router.get("/lessons/:id", async (req, res) => {
    try {
        const lesson = await educationService.getLessonById(req.params.id);
        if (!lesson) {
            res.status(404).json({ message: "Lesson not found" });
            return;
        }
        res.json(lesson);
    } catch (error) {
        console.error("Error fetching lesson:", error);
        res.status(500).json({ message: "Failed to fetch lesson" });
    }
});

// PUT /lessons/:id/watch-progress - Update video watch progress
router.put("/lessons/:id/watch-progress", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { watchedPercent } = req.body;

        if (typeof watchedPercent !== "number" || watchedPercent < 0 || watchedPercent > 100) {
            res.status(400).json({ message: "watchedPercent must be a number between 0 and 100" });
            return;
        }

        const result = await educationService.updateVideoProgress(userId, req.params.id as string, watchedPercent);
        res.json(result);
    } catch (error: any) {
        console.error("Error updating video progress:", error);
        res.status(500).json({ message: error.message || "Failed to update progress" });
    }
});

// POST /lessons/:id/complete - Mark lesson as complete
router.post("/lessons/:id/complete", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const result = await educationService.completeLesson(userId, req.params.id as string);
        res.json(result);
    } catch (error: any) {
        console.error("Error completing lesson:", error);
        res.status(400).json({ message: error.message || "Failed to complete lesson" });
    }
});

// ==================== QUIZ ENDPOINTS ====================

// GET /courses/:id/quiz - Get quiz for a course
router.get("/courses/:id/quiz", async (req, res) => {
    try {
        const quiz = await educationService.getQuizByCourseId(req.params.id);
        if (!quiz) {
            res.status(404).json({ message: "Quiz not found for this course" });
            return;
        }
        // Remove correct answers for public response
        const sanitizedQuiz = {
            ...quiz,
            questions: quiz.questions.map((q) => ({
                id: q.id,
                text: q.text,
                type: q.type,
                options: q.options,
                order: q.order,
            })),
        };
        res.json(sanitizedQuiz);
    } catch (error) {
        console.error("Error fetching quiz:", error);
        res.status(500).json({ message: "Failed to fetch quiz" });
    }
});

// POST /quiz/:id/attempt - Submit quiz answers
router.post("/quiz/:id/attempt", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const { answers } = req.body;

        if (!answers || typeof answers !== "object") {
            res.status(400).json({ message: "answers must be an object mapping questionId to answer" });
            return;
        }

        const result = await educationService.submitQuizAttempt(userId, req.params.id as string, answers);
        res.json(result);
    } catch (error: any) {
        console.error("Error submitting quiz:", error);
        res.status(400).json({ message: error.message || "Failed to submit quiz" });
    }
});

// GET /quiz/attempts - Get user's quiz attempts
router.get("/quiz/attempts", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const quizId = req.query.quizId as string | undefined;
        const attempts = await educationService.getUserQuizAttempts(userId, quizId);
        res.json(attempts);
    } catch (error) {
        console.error("Error fetching quiz attempts:", error);
        res.status(500).json({ message: "Failed to fetch attempts" });
    }
});

// ==================== REWARD ENDPOINTS ====================

// GET /users/rewards - Get user's rewards
router.get("/users/rewards", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const rewards = await educationService.getUserRewards(userId);
        res.json(rewards);
    } catch (error) {
        console.error("Error fetching rewards:", error);
        res.status(500).json({ message: "Failed to fetch rewards" });
    }
});

// GET /users/streak - Get user's learning streak
router.get("/users/streak", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const streak = await educationService.getUserStreak(userId);
        res.json(streak);
    } catch (error) {
        console.error("Error fetching streak:", error);
        res.status(500).json({ message: "Failed to fetch streak" });
    }
});

// GET /users/stats - Get user's education stats
router.get("/users/stats", authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;
        const stats = await educationService.getUserEducationStats(userId);
        res.json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});

// ==================== LEGACY ENDPOINTS (for backward compatibility) ====================

// GET /modules - Alias for /courses
router.get("/modules", async (req, res) => {
    const difficulty = req.query.difficulty as string;
    const courses = await educationService.getCourses({ difficulty });
    res.json(courses);
});

// GET /modules/:id - Alias for /courses/:id
router.get("/modules/:id", async (req, res) => {
    const course = await educationService.getCourseById(req.params.id);
    if (!course) {
        res.status(404).json({ message: "Course not found" });
        return;
    }
    res.json(course);
});

// POST /modules/:id/progress - Update course progress (legacy)
router.post("/modules/:id/progress", authMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.user.id;
    const { progress } = req.body;

    if (typeof progress !== "number") {
        res.status(400).json({ message: "Progress must be a number" });
        return;
    }

    // This is a simplified version - the new system calculates progress automatically
    res.json({ success: true, progress });
});

export default router;
