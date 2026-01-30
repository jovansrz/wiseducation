import "dotenv/config";
import { db } from "../db";
import { course, lesson, quiz, question } from "../db/schema";
import { v4 as uuidv4 } from "uuid";

async function seed() {
    console.log("🌱 Seeding education data...");

    // 1. Course: Introduction to Investing
    const courseId1 = uuidv4();
    await db.insert(course).values({
        id: courseId1,
        title: "Introduction to Investing",
        description: "Learn the fundamentals of investing, why it's important, and how to get started safely.",
        difficulty: "Beginner",
        coverImageUrl: "https://images.unsplash.com/photo-1579532507281-28680d3e6221?q=80&w=2670&auto=format&fit=crop",
        type: "text",
        order: 1,
        totalDurationMinutes: 45,
    });

    // Lessons for Course 1
    const lessonId1_1 = uuidv4();
    await db.insert(lesson).values({
        id: lessonId1_1,
        courseId: courseId1,
        title: "Why Invest?",
        content: `
# Why Investing Matters

Investing is one of the most effective ways to build wealth over time. Unlike saving, where your money sits idle, investing puts your money to work.

## Inflation
Over time, the value of money decreases due to inflation. If you keep your money under a mattress, it loses purchasing power. Investing helps you beat inflation.

## Compounding
Compound interest is the "eighth wonder of the world". It's when you earn interest on your interest. The earlier you start, the more powerful this effect becomes.

## Financial Goals
Whether it's buying a house, retiring comfortably, or traveling, investing helps you reach your financial goals faster.
        `,
        type: "text",
        order: 1,
        durationMinutes: 10,
    });

    const lessonId1_2 = uuidv4();
    await db.insert(lesson).values({
        id: lessonId1_2,
        courseId: courseId1,
        title: "Risk vs. Reward",
        content: `
# Understanding Risk and Reward

In investing, risk and reward go hand in hand. Generally, higher potential returns come with higher risk.

## Types of Assets
* **Stocks**: High potential return, high risk. Ownership in a company.
* **Bonds**: Lower risk, lower return. Loans to companies or governments.
* **Cash**: Lowest risk, lowest return.

## Diversification
"Don't put all your eggs in one basket." Spreading your investments across different assets reduces risk.
        `,
        type: "text",
        order: 2,
        durationMinutes: 15,
    });

    // Quiz for Course 1
    const quizId1 = uuidv4();
    await db.insert(quiz).values({
        id: quizId1,
        courseId: courseId1,
        title: "Investing Basics Quiz",
        passingScore: 70,
    });

    await db.insert(question).values([
        {
            id: uuidv4(),
            quizId: quizId1,
            text: "What is the main reason to invest instead of just saving?",
            type: "single",
            options: [
                { id: "a", text: "To lose money safely" },
                { id: "b", text: "To beat inflation and build wealth" },
                { id: "c", text: "To avoid bank fees" }
            ],
            correctAnswer: ["b"],
            order: 1
        },
        {
            id: uuidv4(),
            quizId: quizId1,
            text: "Which asset class typically has the highest risk?",
            type: "single",
            options: [
                { id: "a", text: "Government Bonds" },
                { id: "b", text: "Cash" },
                { id: "c", text: "Stocks" }
            ],
            correctAnswer: ["c"],
            order: 2
        }
    ]);


    // 2. Course: Stock Market 101
    const courseId2 = uuidv4();
    await db.insert(course).values({
        id: courseId2,
        title: "Stock Market 101",
        description: "What is a stock? How does the market work? Master the basics of equity trading.",
        difficulty: "Beginner",
        coverImageUrl: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop",
        type: "video",
        order: 2,
        totalDurationMinutes: 60,
    });

    // Lessons for Course 2
    const lessonId2_1 = uuidv4();
    await db.insert(lesson).values({
        id: lessonId2_1,
        courseId: courseId2,
        title: "What is a Stock?",
        content: "Watch this video to understand what it means to own a share of a company.",
        videoUrl: "https://www.youtube.com/watch?v=p7HKvqRI_Bo", // Example content
        type: "video",
        order: 1,
        durationMinutes: 12,
    });

    // Quiz for Course 2
    const quizId2 = uuidv4();
    await db.insert(quiz).values({
        id: quizId2,
        courseId: courseId2,
        title: "Stock Market Basics Quiz",
        passingScore: 80,
    });

    await db.insert(question).values([
        {
            id: uuidv4(),
            quizId: quizId2,
            text: "When you buy a stock, what are you buying?",
            type: "single",
            options: [
                { id: "a", text: "A loan to the company" },
                { id: "b", text: "A piece of ownership in the company" },
                { id: "c", text: "A product from the company" }
            ],
            correctAnswer: ["b"],
            order: 1
        },
        {
            id: uuidv4(),
            quizId: quizId2,
            text: "What determines the price of a stock in the short term?",
            type: "single",
            options: [
                { id: "a", text: "The CEO's mood" },
                { id: "b", text: "Supply and demand" },
                { id: "c", text: "Fixed government rates" }
            ],
            correctAnswer: ["b"],
            order: 2
        }
    ]);

    console.log("✅ Seeding complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
