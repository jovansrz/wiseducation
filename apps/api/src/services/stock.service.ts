import { db } from "../db/index.js";
import { stock } from "../db/schema/stock.js";
import { eq, ilike } from "drizzle-orm";

export const stockService = {
    async getAllStocks() {
        return await db.select().from(stock);
    },

    async getStockByTicker(ticker: string) {
        const [item] = await db
            .select()
            .from(stock)
            .where(eq(stock.ticker, ticker))
            .limit(1);
        return item;
    },

    async searchStocks(query: string) {
        return await db
            .select()
            .from(stock)
            .where(ilike(stock.name, `%${query}%`))
            .limit(10);
    }
};
