import { db } from "../db/index.js";
import { course, lesson, userCourseProgress, userLessonProgress } from "../db/schema/course.js";
import { quiz, question, quizAttempt } from "../db/schema/quiz.js";
import { reward, learningStreak, REWARD_AMOUNTS } from "../db/schema/reward.js";
import { portfolio } from "../db/schema/portfolio.js";
import { eq, and, desc, asc } from "drizzle-orm";

const MIN_VIDEO_WATCH_PERCENT = 75; // Must watch at least 75% to complete

export const educationService = {
    // ==================== COURSE MANAGEMENT ====================

    async getCourses(filters?: { difficulty?: string }) {
        if (filters?.difficulty) {
            return await db
                .select()
                .from(course)
                .where(eq(course.difficulty, filters.difficulty))
                .orderBy(asc(course.order));
        }
        return await db.select().from(course).orderBy(asc(course.order));
    },

    async getCourseById(id: string) {
        const [item] = await db
            .select()
            .from(course)
            .where(eq(course.id, id))
            .limit(1);
        return item;
    },

    async getCourseWithLessons(courseId: string) {
        const courseData = await this.getCourseById(courseId);
        if (!courseData) return null;

        const lessons = await db
            .select()
            .from(lesson)
            .where(eq(lesson.courseId, courseId))
            .orderBy(asc(lesson.order));

        return { ...courseData, lessons };
    },

    async getCoursesWithProgress(userId: string, filters?: { difficulty?: string }) {
        const courses = await this.getCourses(filters);

        const coursesWithProgress = await Promise.all(
            courses.map(async (c) => {
                const progress = await this.getUserCourseProgress(userId, c.id);
                return {
                    ...c,
                    progress: progress?.progress || 0,
                    completed: progress?.completed || false,
                };
            })
        );

        return coursesWithProgress;
    },

    // ==================== LESSON MANAGEMENT ====================

    async getLessonById(lessonId: string) {
        const [item] = await db
            .select()
            .from(lesson)
            .where(eq(lesson.id, lessonId))
            .limit(1);
        return item;
    },

    async getLessonsByCourseid(courseId: string) {
        return await db
            .select()
            .from(lesson)
            .where(eq(lesson.courseId, courseId))
            .orderBy(asc(lesson.order));
    },

    async getLessonsWithProgress(userId: string, courseId: string) {
        const lessons = await this.getLessonsByCourseid(courseId);

        const lessonsWithProgress = await Promise.all(
            lessons.map(async (l) => {
                const progress = await this.getUserLessonProgress(userId, l.id);
                return {
                    ...l,
                    completed: progress?.completed || false,
                    videoWatchedPercent: progress?.videoWatchedPercent || 0,
                };
            })
        );

        return lessonsWithProgress;
    },

    // ==================== PROGRESS TRACKING ====================

    async getUserCourseProgress(userId: string, courseId: string) {
        const [progress] = await db
            .select()
            .from(userCourseProgress)
            .where(
                and(
                    eq(userCourseProgress.userId, userId),
                    eq(userCourseProgress.courseId, courseId)
                )
            )
            .limit(1);

        return progress;
    },

    async getUserLessonProgress(userId: string, lessonId: string) {
        const [progress] = await db
            .select()
            .from(userLessonProgress)
            .where(
                and(
                    eq(userLessonProgress.userId, lessonId),
                    eq(userLessonProgress.lessonId, lessonId)
                )
            )
            .limit(1);

        return progress;
    },

    async updateVideoProgress(userId: string, lessonId: string, watchedPercent: number) {
        const lessonData = await this.getLessonById(lessonId);
        if (!lessonData) throw new Error("Lesson not found");

        // Get or create lesson progress
        let [progress] = await db
            .select()
            .from(userLessonProgress)
            .where(
                and(
                    eq(userLessonProgress.userId, userId),
                    eq(userLessonProgress.lessonId, lessonId)
                )
            )
            .limit(1);

        const now = new Date();
        const isComplete = watchedPercent >= MIN_VIDEO_WATCH_PERCENT;

        if (progress) {
            // Only update if new percentage is higher
            if (watchedPercent > progress.videoWatchedPercent) {
                await db
                    .update(userLessonProgress)
                    .set({
                        videoWatchedPercent: watchedPercent,
                        lastWatchedAt: now,
                        completed: isComplete || progress.completed,
                        completedAt: isComplete && !progress.completed ? now : progress.completedAt,
                    })
                    .where(eq(userLessonProgress.id, progress.id));
            }
        } else {
            await db.insert(userLessonProgress).values({
                id: crypto.randomUUID(),
                userId,
                lessonId,
                videoWatchedPercent: watchedPercent,
                lastWatchedAt: now,
                completed: isComplete,
                completedAt: isComplete ? now : null,
            });
        }

        // Update course progress
        await this.recalculateCourseProgress(userId, lessonData.courseId);

        // Update streak
        await this.updateLearningStreak(userId);

        return { success: true, isComplete };
    },

    async completeLesson(userId: string, lessonId: string) {
        const lessonData = await this.getLessonById(lessonId);
        if (!lessonData) throw new Error("Lesson not found");

        // Check if video type - must watch 75%
        if (lessonData.type === "video") {
            const progress = await this.getUserLessonProgress(userId, lessonId);
            if (!progress || progress.videoWatchedPercent < MIN_VIDEO_WATCH_PERCENT) {
                throw new Error(`Must watch at least ${MIN_VIDEO_WATCH_PERCENT}% of the video to complete`);
            }
        }

        const now = new Date();
        let [existing] = await db
            .select()
            .from(userLessonProgress)
            .where(
                and(
                    eq(userLessonProgress.userId, userId),
                    eq(userLessonProgress.lessonId, lessonId)
                )
            )
            .limit(1);

        if (existing) {
            await db
                .update(userLessonProgress)
                .set({ completed: true, completedAt: now })
                .where(eq(userLessonProgress.id, existing.id));
        } else {
            await db.insert(userLessonProgress).values({
                id: crypto.randomUUID(),
                userId,
                lessonId,
                completed: true,
                completedAt: now,
            });
        }

        // Update course progress
        await this.recalculateCourseProgress(userId, lessonData.courseId);

        return { success: true };
    },

    async recalculateCourseProgress(userId: string, courseId: string) {
        const lessons = await this.getLessonsByCourseid(courseId);
        if (lessons.length === 0) return;

        const lessonProgresses = await Promise.all(
            lessons.map((l) => this.getUserLessonProgress(userId, l.id))
        );

        const completedCount = lessonProgresses.filter((p) => p?.completed).length;
        const progressPercent = Math.round((completedCount / lessons.length) * 100);
        const allCompleted = completedCount === lessons.length;

        let [existing] = await db
            .select()
            .from(userCourseProgress)
            .where(
                and(
                    eq(userCourseProgress.userId, userId),
                    eq(userCourseProgress.courseId, courseId)
                )
            )
            .limit(1);

        const now = new Date();

        if (existing) {
            await db
                .update(userCourseProgress)
                .set({
                    progress: progressPercent,
                    completed: allCompleted,
                    completedAt: allCompleted && !existing.completed ? now : existing.completedAt,
                    updatedAt: now,
                })
                .where(eq(userCourseProgress.id, existing.id));
        } else {
            await db.insert(userCourseProgress).values({
                id: crypto.randomUUID(),
                userId,
                courseId,
                progress: progressPercent,
                completed: allCompleted,
                completedAt: allCompleted ? now : null,
            });
        }
    },

    // ==================== QUIZ SYSTEM ====================

    async getQuizByCourseId(courseId: string) {
        const [quizData] = await db
            .select()
            .from(quiz)
            .where(eq(quiz.courseId, courseId))
            .limit(1);

        if (!quizData) return null;

        const questions = await db
            .select()
            .from(question)
            .where(eq(question.quizId, quizData.id))
            .orderBy(asc(question.order));

        return { ...quizData, questions };
    },

    async submitQuizAttempt(
        userId: string,
        quizId: string,
        answers: Record<string, string>
    ) {
        const [quizData] = await db
            .select()
            .from(quiz)
            .where(eq(quiz.id, quizId))
            .limit(1);

        if (!quizData) throw new Error("Quiz not found");

        const questions = await db
            .select()
            .from(question)
            .where(eq(question.quizId, quizId));

        // Calculate score
        let correctCount = 0;
        const results = questions.map((q) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer?.toLowerCase() === q.correctAnswer.toLowerCase();
            if (isCorrect) correctCount++;
            return {
                questionId: q.id,
                userAnswer,
                correctAnswer: q.correctAnswer,
                isCorrect,
                explanation: q.explanation,
            };
        });

        const score = Math.round((correctCount / questions.length) * 100);
        const passed = score >= quizData.passingScore;
        const isPerfect = score === 100;

        // Save attempt
        const [attempt] = await db
            .insert(quizAttempt)
            .values({
                id: crypto.randomUUID(),
                userId,
                quizId,
                score,
                passed,
                answers,
            })
            .returning();

        // Award rewards
        if (isPerfect) {
            await this.awardReward(userId, "quiz_perfect", REWARD_AMOUNTS.QUIZ_PERFECT, `Perfect score on quiz: ${quizData.title}`);
        }

        // Check for level completion
        if (passed) {
            await this.checkLevelCompletion(userId, quizData.courseId);
        }

        return { attempt, results, score, passed, isPerfect };
    },

    async getUserQuizAttempts(userId: string, quizId?: string) {
        if (quizId) {
            return await db
                .select()
                .from(quizAttempt)
                .where(
                    and(eq(quizAttempt.userId, userId), eq(quizAttempt.quizId, quizId))
                )
                .orderBy(desc(quizAttempt.completedAt));
        }
        return await db
            .select()
            .from(quizAttempt)
            .where(eq(quizAttempt.userId, userId))
            .orderBy(desc(quizAttempt.completedAt));
    },

    // ==================== REWARD SYSTEM ====================

    async awardReward(userId: string, type: string, amount: number, description: string) {
        // Check if reward already exists (prevent duplicates)
        const [existing] = await db
            .select()
            .from(reward)
            .where(
                and(
                    eq(reward.userId, userId),
                    eq(reward.type, type),
                    eq(reward.description, description)
                )
            )
            .limit(1);

        if (existing) return null; // Already awarded

        // Award the reward
        const [newReward] = await db
            .insert(reward)
            .values({
                id: crypto.randomUUID(),
                userId,
                type,
                amount,
                description,
            })
            .returning();

        // Add to user's portfolio
        const [userPortfolio] = await db
            .select()
            .from(portfolio)
            .where(eq(portfolio.userId, userId))
            .limit(1);

        if (userPortfolio) {
            await db
                .update(portfolio)
                .set({ balance: userPortfolio.balance + amount })
                .where(eq(portfolio.id, userPortfolio.id));
        }

        return newReward;
    },

    async checkLevelCompletion(userId: string, courseId: string) {
        const courseData = await this.getCourseById(courseId);
        if (!courseData) return;

        // Get all courses in this difficulty level
        const levelCourses = await db
            .select()
            .from(course)
            .where(eq(course.difficulty, courseData.difficulty));

        // Check if all have passed quizzes
        const allCompleted = await Promise.all(
            levelCourses.map(async (c) => {
                const quizData = await this.getQuizByCourseId(c.id);
                if (!quizData) return true; // No quiz = considered complete

                const attempts = await this.getUserQuizAttempts(userId, quizData.id);
                return attempts.some((a) => a.passed);
            })
        );

        if (allCompleted.every((c) => c)) {
            // Award level completion reward
            const rewardAmount =
                courseData.difficulty === "Advanced" ? REWARD_AMOUNTS.ADVANCED_COMPLETION :
                    courseData.difficulty === "Intermediate" ? REWARD_AMOUNTS.INTERMEDIATE_COMPLETION :
                        REWARD_AMOUNTS.BEGINNER_COMPLETION;

            await this.awardReward(
                userId,
                "level_completion",
                rewardAmount,
                `Completed ${courseData.difficulty} Level`
            );
        }
    },

    async getUserRewards(userId: string) {
        return await db
            .select()
            .from(reward)
            .where(eq(reward.userId, userId))
            .orderBy(desc(reward.awardedAt));
    },

    // ==================== STREAK SYSTEM ====================

    async updateLearningStreak(userId: string) {
        const [streak] = await db
            .select()
            .from(learningStreak)
            .where(eq(learningStreak.userId, userId))
            .limit(1);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (streak) {
            const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
            if (lastActivity) {
                lastActivity.setHours(0, 0, 0, 0);
            }

            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            let newStreak = streak.currentStreak;

            if (!lastActivity || lastActivity.getTime() < yesterday.getTime()) {
                // Streak broken
                newStreak = 1;
            } else if (lastActivity.getTime() === yesterday.getTime()) {
                // Continue streak
                newStreak = streak.currentStreak + 1;
            }
            // Same day = no change

            const longestStreak = Math.max(streak.longestStreak, newStreak);

            await db
                .update(learningStreak)
                .set({
                    currentStreak: newStreak,
                    longestStreak,
                    lastActivityDate: today,
                    updatedAt: new Date(),
                })
                .where(eq(learningStreak.id, streak.id));

            // Award 7-day streak bonus
            if (newStreak === 7 && streak.currentStreak < 7) {
                await this.awardReward(
                    userId,
                    "streak",
                    REWARD_AMOUNTS.STREAK_7_DAY,
                    "7-Day Learning Streak"
                );
            }

            return { currentStreak: newStreak, longestStreak };
        } else {
            await db.insert(learningStreak).values({
                id: crypto.randomUUID(),
                userId,
                currentStreak: 1,
                longestStreak: 1,
                lastActivityDate: today,
            });
            return { currentStreak: 1, longestStreak: 1 };
        }
    },

    async getUserStreak(userId: string) {
        const [streak] = await db
            .select()
            .from(learningStreak)
            .where(eq(learningStreak.userId, userId))
            .limit(1);

        return streak || { currentStreak: 0, longestStreak: 0 };
    },

    // ==================== USER STATS ====================

    async getUserEducationStats(userId: string) {
        const courses = await this.getCoursesWithProgress(userId);
        const rewards = await this.getUserRewards(userId);
        const streak = await this.getUserStreak(userId);
        const quizAttempts = await this.getUserQuizAttempts(userId);

        const completedCourses = courses.filter((c) => c.completed).length;
        const totalRewards = rewards.reduce((sum, r) => sum + r.amount, 0);
        const passedQuizzes = quizAttempts.filter((a) => a.passed).length;

        return {
            totalCourses: courses.length,
            completedCourses,
            progressPercentage: Math.round((completedCourses / courses.length) * 100) || 0,
            totalRewards,
            rewardsCount: rewards.length,
            passedQuizzes,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
        };
    },
};
