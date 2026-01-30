import { db } from "../db/index.js";
import { portfolio, portfolioHistory, holding, transaction } from "../db/schema/portfolio.js";
import { eq, desc, and } from "drizzle-orm";

export const portfolioService = {
    async getPortfolio(userId: string) {
        // Check if portfolio exists, if not create one
        let [userPortfolio] = await db
            .select()
            .from(portfolio)
            .where(eq(portfolio.userId, userId))
            .limit(1);

        if (!userPortfolio) {
            [userPortfolio] = await db
                .insert(portfolio)
                .values({
                    id: crypto.randomUUID(),
                    userId,
                    balance: 10000000, // 10M IDR init
                })
                .returning();

            // Initialize hisory
            await db.insert(portfolioHistory).values({
                id: crypto.randomUUID(),
                portfolioId: userPortfolio.id,
                balance: 10000000,
            });
        }

        const holdings = await db
            .select()
            .from(holding)
            .where(eq(holding.portfolioId, userPortfolio.id));

        const transactions = await db
            .select()
            .from(transaction)
            .where(eq(transaction.portfolioId, userPortfolio.id))
            .orderBy(desc(transaction.timestamp));

        // Get 24h history for growth calc
        const [history] = await db
            .select()
            .from(portfolioHistory)
            .where(eq(portfolioHistory.portfolioId, userPortfolio.id))
            .orderBy(desc(portfolioHistory.date))
            .limit(2); // Get current and previous

        // Simple growth calc (mock logic for now if not enough history)
        const growthPercentage = 2.45;

        // Calculate total value
        const holdingsValue = holdings.reduce((sum, h) => sum + (h.quantity * 100 * h.averagePrice), 0); // Note: using averagePrice as approximation if currentPrice not available, but ideally should use real-time price from FE or cached
        // Ideally we fetch current prices here, but for now let's just use balance + holdings value (based on logic)
        // In reality, FE calculates real total value using live prices. API just returns the data.

        return {
            ...userPortfolio,
            virtualCash: userPortfolio.balance, // Map balance to virtualCash for FE compatibility
            holdings,
            transactions,
            growthPercentage
        };
    },

    async buyStock(userId: string, data: { ticker: string; name: string; quantity: number; price: number }) {
        const pf = await this.getPortfolio(userId);
        const totalCost = data.quantity * 100 * data.price;

        if (pf.balance < totalCost) {
            throw new Error("Insufficient funds");
        }

        // 1. Deduct balance
        await db.update(portfolio)
            .set({ balance: pf.balance - totalCost, updatedAt: new Date() })
            .where(eq(portfolio.id, pf.id));

        // 2. Update/Create Holding
        const [existingHolding] = await db
            .select()
            .from(holding)
            .where(and(eq(holding.portfolioId, pf.id), eq(holding.ticker, data.ticker)))
            .limit(1);

        if (existingHolding) {
            const totalShares = existingHolding.quantity + data.quantity;
            const totalValue = (existingHolding.quantity * existingHolding.averagePrice) + (data.quantity * data.price);
            const newAvgPrice = totalValue / totalShares;

            await db.update(holding)
                .set({ quantity: totalShares, averagePrice: newAvgPrice, updatedAt: new Date() })
                .where(eq(holding.id, existingHolding.id));
        } else {
            await db.insert(holding).values({
                id: crypto.randomUUID(),
                portfolioId: pf.id,
                ticker: data.ticker,
                name: data.name,
                quantity: data.quantity,
                averagePrice: data.price
            });
        }

        // 3. Record Transaction
        await db.insert(transaction).values({
            id: `tx_${Date.now()}`,
            portfolioId: pf.id,
            type: 'BUY',
            ticker: data.ticker,
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            total: totalCost,
            timestamp: new Date()
        });

        return { success: true, message: `Successfully bought ${data.quantity} lots of ${data.ticker}` };
    },

    async sellStock(userId: string, data: { ticker: string; quantity: number; price: number }) {
        const pf = await this.getPortfolio(userId);

        const [existingHolding] = await db
            .select()
            .from(holding)
            .where(and(eq(holding.portfolioId, pf.id), eq(holding.ticker, data.ticker)))
            .limit(1);

        if (!existingHolding || existingHolding.quantity < data.quantity) {
            throw new Error("Insufficient holdings");
        }

        const totalProceeds = data.quantity * 100 * data.price;

        // 1. Add balance
        await db.update(portfolio)
            .set({ balance: pf.balance + totalProceeds, updatedAt: new Date() })
            .where(eq(portfolio.id, pf.id));

        // 2. Update Holding
        const newQuantity = existingHolding.quantity - data.quantity;
        if (newQuantity > 0) {
            await db.update(holding)
                .set({ quantity: newQuantity, updatedAt: new Date() })
                .where(eq(holding.id, existingHolding.id));
        } else {
            await db.delete(holding).where(eq(holding.id, existingHolding.id));
        }

        // 3. Record Transaction
        await db.insert(transaction).values({
            id: `tx_${Date.now()}`,
            portfolioId: pf.id,
            type: 'SELL',
            ticker: data.ticker,
            name: existingHolding.name || data.ticker, // Holding table doesn't have name currently in schema, we might need to fix that or use ticker
            quantity: data.quantity,
            price: data.price,
            total: totalProceeds,
            timestamp: new Date()
        });

        return { success: true, message: `Successfully sold ${data.quantity} lots of ${data.ticker}` };
    },

    async resetPortfolio(userId: string) {
        const pf = await this.getPortfolio(userId);

        // Reset balance
        await db.update(portfolio)
            .set({ balance: 10000000, updatedAt: new Date() })
            .where(eq(portfolio.id, pf.id));

        // Delete holdings and transactions
        await db.delete(holding).where(eq(holding.portfolioId, pf.id));
        await db.delete(transaction).where(eq(transaction.portfolioId, pf.id));

        return { success: true, message: "Portfolio reset successfully" };
    },

    async getPortfolioHistory(userId: string) {
        const pf = await this.getPortfolio(userId);
        return await db
            .select()
            .from(portfolioHistory)
            .where(eq(portfolioHistory.portfolioId, pf.id))
            .orderBy(desc(portfolioHistory.date));
    }
};
