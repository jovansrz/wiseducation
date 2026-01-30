import { pgTable, text, real, timestamp } from "drizzle-orm/pg-core";

export const stock = pgTable("stock", {
    ticker: text("ticker").primaryKey(),
    name: text("name").notNull(),
    price: real("price").notNull(),
    changePercent: real("change_percent").notNull().default(0),
    changeValue: real("change_value").notNull().default(0),
    volume: text("volume"),
    marketCap: text("market_cap"),
    peRatio: text("pe_ratio"),
    divYield: text("div_yield"),
    description: text("description"),
    sector: text("sector"),
    ceo: text("ceo"),
    founded: text("founded"),
    employees: text("employees"),
    logoUrl: text("logo_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
