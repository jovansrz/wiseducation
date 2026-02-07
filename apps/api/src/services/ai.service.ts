import OpenAI from "openai";
import dotenv from "dotenv";
import { db } from "../db/index.js";
import { aiThreads, aiMessages, portfolio, holding, stock, gameStats } from "../db/schema/index.js";
import { eq, desc, asc } from "drizzle-orm";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// Tool Definitions
const tools = [
    {
        type: "function",
        function: {
            name: "get_my_portfolio",
            description: "Get the current user's investment portfolio, including cash balance, list of stock holdings, and total portfolio value.",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_stock_price",
            description: "Get the current price and details of a specific stock ticker (e.g., BBCA, TLKM).",
            parameters: {
                type: "object",
                properties: {
                    ticker: {
                        type: "string",
                        description: "The stock ticker symbol (e.g. BBCA)"
                    },
                },
                required: ["ticker"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_my_game_stats",
            description: "Get the current user's game statistics, including high scores, virtual cash earned from games, and total games played.",
            parameters: {
                type: "object",
                properties: {},
            },
        },
    }
];

export const aiService = {
    async getThreads(userId: string) {
        return db.select().from(aiThreads)
            .where(eq(aiThreads.userId, userId))
            .orderBy(desc(aiThreads.updatedAt));
    },

    async getThreadMessages(threadId: string, userId: string) {
        // Verify thread belongs to user
        const thread = await db.query.aiThreads.findFirst({
            where: (threads: any, { eq, and }: any) => and(eq(threads.id, threadId), eq(threads.userId, userId))
        });

        if (!thread) return null;

        return db.select().from(aiMessages)
            .where(eq(aiMessages.threadId, threadId))
            .orderBy(asc(aiMessages.createdAt));
    },

    async createThread(userId: string, title: string = "New Chat") {
        const [thread] = await db.insert(aiThreads)
            .values({ userId, title })
            .returning();
        return thread;
    },

    async deleteThread(threadId: string, userId: string) {
        await db.delete(aiThreads)
            .where(eq(aiThreads.id, threadId));
    },

    // --- Data Helpers ---

    async getUserPortfolio(userId: string) {
        const userPortfolio = await db.query.portfolio.findFirst({
            where: (p: any, { eq }: any) => eq(p.userId, userId),
            with: {
                holdings: true,
            }
        });

        if (!userPortfolio) return "User has no portfolio yet.";

        let totalValue = userPortfolio.balance;
        const holdingsDetails = [];

        // Manually fetch holdings if relation query is tricky with type/schema setup, 
        // but 'with' should work if relations are defined. 
        // If not defined in schema relations, we query manually.
        // Assuming relations might not be fully exported/setup in index, let's safe query manually:

        const holdings = await db.select().from(holding).where(eq(holding.portfolioId, userPortfolio.id));

        for (const h of holdings) {
            const stockInfo = await db.query.stock.findFirst({
                where: (s: any, { eq }: any) => eq(s.ticker, h.ticker)
            });
            const currentPrice = stockInfo?.price || h.averagePrice;
            const value = h.quantity * currentPrice;
            totalValue += value;

            holdingsDetails.push({
                ticker: h.ticker,
                quantity: h.quantity,
                avgPrice: h.averagePrice,
                currentPrice: currentPrice,
                currentValue: value,
                pl: value - (h.quantity * h.averagePrice)
            });
        }

        return {
            cashBalance: userPortfolio.balance,
            totalPortfolioValue: totalValue,
            holdings: holdingsDetails
        };
    },

    async getStockPrice(ticker: string) {
        const stockInfo = await db.query.stock.findFirst({
            where: (s: any, { eq }: any) => eq(s.ticker, ticker.toUpperCase())
        });
        if (!stockInfo) return `Stock ${ticker} not found.`;
        return stockInfo;
    },

    async getUserGameStats(userId: string) {
        const stats = await db.query.gameStats.findFirst({
            where: (s: any, { eq }: any) => eq(s.userId, userId)
        });
        if (!stats) return "No game stats found.";
        return stats;
    },

    // --- Chat Logic ---

    async chat(userId: string, message: string, threadId?: string) {
        try {
            let currentThreadId = threadId;

            // 1. Create thread if needed
            if (!currentThreadId) {
                let title = "New Chat";
                try {
                    const titleCompletion = await openai.chat.completions.create({
                        messages: [
                            { role: "system", content: "Summarize the user message into a short 3-5 word title for a chat history." },
                            { role: "user", content: message }
                        ],
                        model: "llama-3.3-70b-versatile",
                    });
                    title = titleCompletion.choices[0].message.content?.replace(/^"|"$/g, '') || "New Chat";
                } catch (e) { }

                const newThread = await this.createThread(userId, title);
                currentThreadId = newThread.id;
            }

            // 2. Save User Message
            await db.insert(aiMessages).values({
                threadId: currentThreadId!,
                role: 'user',
                content: message
            });

            // 3. Prepare Context
            const history = await db.select().from(aiMessages)
                .where(eq(aiMessages.threadId, currentThreadId!))
                .orderBy(asc(aiMessages.createdAt))
                .limit(20);

            const systemPrompt = `You are the WISEducation Financial Assistant.
            
            Capabilities:
            - You can access the user's PORTFOLIO, GAME STATS, and LIVE STOCK PRICES using tools.
            - ALWAYS check the user's portfolio if they ask about "my stocks", "my holdings", or "how am I doing".
            - Use the 'get_stock_price' tool if they ask about a specific stock (e.g. "How is BBCA?").
            
            Context:
            - User ID: ${userId}
            - Application: WISEducation (Financial Literacy Platform)
            
            Traits:
            - Helpful, data-driven, and educational.
            - Analyze the data returned by tools to give personalized advice.
            `;

            const messages: any[] = [
                { role: "system", content: systemPrompt },
                ...history.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content }))
            ];

            // 4. AI Tool Call Loop
            let finalResponse = "";
            let keepGoing = true;
            let iterations = 0;
            const executedTools = new Set<string>(); // Track executed tools to prevent loops (simple dedup for now)

            while (keepGoing && iterations < 5) {
                iterations++;

                try {
                    const completion = await openai.chat.completions.create({
                        messages: messages,
                        model: "llama-3.3-70b-versatile",
                        // @ts-ignore
                        tools: tools,
                        tool_choice: "auto",
                    });

                    const msg = completion.choices[0].message;
                    messages.push(msg); // Add AI's response (maybe tool call) to history

                    if (msg.tool_calls && msg.tool_calls.length > 0) {
                        // Check if we are just looping on the same tool
                        const toolCallSignature = msg.tool_calls.map((tc: any) => tc.function.name).join(',');
                        // Allow multiple *different* tools, but if we see the exact same set of tools again, be careful.
                        // Ideally we should allow calling same tool with different args, but for this specific "get_portfolio" case receiving no args, it's a loop.

                        // Execute tools
                        for (const toolCall of msg.tool_calls) {
                            const fnName = (toolCall as any).function.name;
                            let args = {};
                            try {
                                args = JSON.parse((toolCall as any).function.arguments);
                            } catch (e) {
                                console.error("Failed to parse tool arguments", e);
                            }

                            // Simple loop prevention for 0-arg tools
                            const callKey = `${fnName}:${JSON.stringify(args)}`;
                            if (executedTools.has(callKey)) {
                                console.log(`Skipping duplicate tool call: ${callKey}`);
                                messages.push({
                                    role: "tool",
                                    tool_call_id: toolCall.id,
                                    content: JSON.stringify({ error: "Tool already executed. Please interpret the previous result." })
                                });
                                continue;
                            }
                            executedTools.add(callKey);

                            let result: any = "Error executing tool";
                            console.log(`Executing tool: ${fnName}`);

                            try {
                                if (fnName === "get_my_portfolio") {
                                    result = await this.getUserPortfolio(userId);
                                } else if (fnName === "get_stock_price") {
                                    // @ts-ignore
                                    result = await this.getStockPrice(args.ticker || "Unknown");
                                } else if (fnName === "get_my_game_stats") {
                                    result = await this.getUserGameStats(userId);
                                }
                            } catch (e) {
                                result = `Error: ${e}`;
                            }

                            console.log(`Tool Result (${fnName}):`, JSON.stringify(result).substring(0, 100) + "...");

                            // Add tool output to messages
                            messages.push({
                                role: "tool",
                                tool_call_id: toolCall.id,
                                content: JSON.stringify(result)
                            });
                        }
                        // Loop continues to get the interpretation of tool outputs
                    } else {
                        // Final text response
                        finalResponse = msg.content || "No response generated.";
                        keepGoing = false;
                    }
                } catch (apiError: any) {
                    console.error("Groq API Error during loop:", apiError);
                    finalResponse = "I encountered an error processing the tool results. Let me try to answer based on what I know: " + (messages[messages.length - 1]?.content || "");
                    keepGoing = false;
                }
            }

            if (!finalResponse && iterations >= 5) {
                finalResponse = "I have collected the data but I'm having trouble finalizing the response. Please check the sidebar or try asking a more specific question.";
            }

            // 5. Save AI Response (only final text)
            await db.insert(aiMessages).values({
                threadId: currentThreadId!,
                role: 'assistant',
                content: finalResponse
            });

            await db.update(aiThreads)
                .set({ updatedAt: new Date() })
                .where(eq(aiThreads.id, currentThreadId!));

            return {
                response: finalResponse,
                timestamp: new Date(),
                threadId: currentThreadId
            };
        } catch (error) {
            console.error("Groq/OpenAI Error:", error);
            // Fallback response instead of crashing
            return {
                response: "I'm having trouble analyzing your data right now. Please try again.",
                timestamp: new Date(),
                threadId: threadId // Return the original threadId or undefined, NOT 'error' string
            };
        }
    }
};
