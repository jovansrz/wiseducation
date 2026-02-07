import "dotenv/config";
import { db } from "../db/index.js";
import { course, lesson } from "../db/schema/course.js";
import { quiz, question } from "../db/schema/quiz.js";
import { v4 as uuidv4 } from "uuid";
import { sql } from "drizzle-orm";

async function seed() {
    console.log("🌱 Seeding new education modules...");

    // First, delete existing data
    console.log("🗑️ Deleting existing courses, lessons, quizzes, and questions...");
    await db.execute(sql`DELETE FROM question`);
    await db.execute(sql`DELETE FROM quiz`);
    await db.execute(sql`DELETE FROM lesson`);
    await db.execute(sql`DELETE FROM course`);
    console.log("✅ Existing data deleted");

    // ============================================================
    // MODULE 1: What is Investment? (Beginner)
    // ============================================================
    const courseId1 = uuidv4();
    await db.insert(course).values({
        id: courseId1,
        title: "What is Investment?",
        description: "Learn what investing means, why it matters for your future, and how to start your investment journey.",
        difficulty: "Beginner",
        coverImageUrl: "https://images.unsplash.com/photo-1579532507281-28680d3e6221?q=80&w=2670&auto=format&fit=crop",
        type: "video",
        order: 1,
        totalDurationMinutes: 15,
    });

    const lessonId1_1 = uuidv4();
    await db.insert(lesson).values({
        id: lessonId1_1,
        courseId: courseId1,
        title: "Introduction to Investing",
        content: "Watch this video to understand the basics of investing and why it's important for your financial future.",
        videoUrl: "https://www.youtube.com/watch?v=gFQNPmLKj1k",
        type: "video",
        order: 1,
        durationMinutes: 15,
    });

    const quizId1 = uuidv4();
    await db.insert(quiz).values({
        id: quizId1,
        courseId: courseId1,
        title: "Investment Basics Quiz",
        passingScore: 70,
    });

    await db.insert(question).values([
        {
            id: uuidv4(),
            quizId: quizId1,
            text: "What is the main purpose of investing?",
            type: "single",
            options: {
                a: "To spend money quickly",
                b: "To grow wealth over time",
                c: "To pay taxes",
            },
            correctAnswer: "b",
            explanation: "Investing helps grow your wealth over time through returns and compound interest.",
            order: 1,
        },
        {
            id: uuidv4(),
            quizId: quizId1,
            text: "What is compound interest?",
            type: "single",
            options: {
                a: "Interest charged on loans only",
                b: "Interest earned on both principal and accumulated interest",
                c: "A type of bank fee",
            },
            correctAnswer: "b",
            explanation: "Compound interest means you earn interest on your interest, accelerating wealth growth.",
            order: 2,
        },
        {
            id: uuidv4(),
            quizId: quizId1,
            text: "Why is starting to invest early beneficial?",
            type: "single",
            options: {
                a: "You get more bank bonuses",
                b: "Compound interest has more time to work",
                c: "Stocks are cheaper when you're young",
            },
            correctAnswer: "b",
            explanation: "The earlier you start, the more time compound interest has to grow your money.",
            order: 3,
        },
    ]);

    // ============================================================
    // MODULE 2: Understanding Stocks (Beginner)
    // ============================================================
    const courseId2 = uuidv4();
    await db.insert(course).values({
        id: courseId2,
        title: "Understanding Stocks",
        description: "Discover what stocks are, how they work, and why companies issue them to the public.",
        difficulty: "Beginner",
        coverImageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop",
        type: "video",
        order: 2,
        totalDurationMinutes: 12,
    });

    const lessonId2_1 = uuidv4();
    await db.insert(lesson).values({
        id: lessonId2_1,
        courseId: courseId2,
        title: "What is a Stock?",
        content: "Learn what it means to own a share of a company and how stocks generate returns.",
        videoUrl: "https://www.youtube.com/watch?v=p7HKvqRI_Bo",
        type: "video",
        order: 1,
        durationMinutes: 12,
    });

    const quizId2 = uuidv4();
    await db.insert(quiz).values({
        id: quizId2,
        courseId: courseId2,
        title: "Stock Fundamentals Quiz",
        passingScore: 70,
    });

    await db.insert(question).values([
        {
            id: uuidv4(),
            quizId: quizId2,
            text: "When you buy a stock, what do you own?",
            type: "single",
            options: {
                a: "A loan to the company",
                b: "A small piece of ownership in the company",
                c: "The company's products",
            },
            correctAnswer: "b",
            explanation: "A stock represents partial ownership in a company.",
            order: 1,
        },
        {
            id: uuidv4(),
            quizId: quizId2,
            text: "How can stockholders make money?",
            type: "single",
            options: {
                a: "Through dividends and stock price appreciation",
                b: "Through interest payments only",
                c: "By working at the company",
            },
            correctAnswer: "a",
            explanation: "Stockholders can earn through dividends (profit sharing) and by selling stock at a higher price.",
            order: 2,
        },
        {
            id: uuidv4(),
            quizId: quizId2,
            text: "Why do companies issue stocks?",
            type: "single",
            options: {
                a: "To pay employees",
                b: "To raise capital for growth and operations",
                c: "To reduce their taxes",
            },
            correctAnswer: "b",
            explanation: "Companies issue stocks to raise funds for expansion, research, and business operations.",
            order: 3,
        },
    ]);

    // ============================================================
    // MODULE 3: Risk & Reward (Intermediate)
    // ============================================================
    const courseId3 = uuidv4();
    await db.insert(course).values({
        id: courseId3,
        title: "Risk and Reward",
        description: "Understand the relationship between risk and potential returns in investing.",
        difficulty: "Intermediate",
        coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
        type: "video",
        order: 3,
        totalDurationMinutes: 10,
    });

    const lessonId3_1 = uuidv4();
    await db.insert(lesson).values({
        id: lessonId3_1,
        courseId: courseId3,
        title: "Understanding Investment Risk",
        content: "Learn about different types of investment risks and how to manage them effectively.",
        videoUrl: "https://www.youtube.com/watch?v=zN1dP0s_8cA",
        type: "video",
        order: 1,
        durationMinutes: 10,
    });

    const quizId3 = uuidv4();
    await db.insert(quiz).values({
        id: quizId3,
        courseId: courseId3,
        title: "Risk Management Quiz",
        passingScore: 70,
    });

    await db.insert(question).values([
        {
            id: uuidv4(),
            quizId: quizId3,
            text: "Generally, higher potential returns come with:",
            type: "single",
            options: {
                a: "Lower risk",
                b: "Higher risk",
                c: "No change in risk",
            },
            correctAnswer: "b",
            explanation: "In investing, higher potential returns typically require taking on more risk.",
            order: 1,
        },
        {
            id: uuidv4(),
            quizId: quizId3,
            text: "What is diversification?",
            type: "single",
            options: {
                a: "Putting all money in one stock",
                b: "Spreading investments across different assets",
                c: "Only investing in bonds",
            },
            correctAnswer: "b",
            explanation: "Diversification means spreading your investments to reduce risk - 'don't put all eggs in one basket'.",
            order: 2,
        },
        {
            id: uuidv4(),
            quizId: quizId3,
            text: "Which asset type is generally considered lowest risk?",
            type: "single",
            options: {
                a: "Cryptocurrency",
                b: "Stocks",
                c: "Government bonds",
            },
            correctAnswer: "c",
            explanation: "Government bonds are considered low-risk as they're backed by the government.",
            order: 3,
        },
    ]);

    console.log("✅ Seeding complete! Created 3 learning modules.");
    console.log("   - 2 Beginner modules");
    console.log("   - 1 Intermediate module");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
