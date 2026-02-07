import { pgTable, text, real, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const portfolio = pgTable("portfolio", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id)
        .unique(),
    balance: real("balance").notNull().default(10000000), // Default 10M IDR for simulation
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const portfolioHistory = pgTable("portfolio_history", {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
        .notNull()
        .references(() => portfolio.id),
    balance: real("balance").notNull(),
    date: timestamp("date").notNull().defaultNow(),
});

export const holding = pgTable("holding", {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
        .notNull()
        .references(() => portfolio.id),
    ticker: text("ticker").notNull(),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    averagePrice: real("average_price").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const transaction = pgTable("transaction", {
    id: text("id").primaryKey(),
    portfolioId: text("portfolio_id")
        .notNull()
        .references(() => portfolio.id),
    type: text("type").notNull(), // 'BUY' or 'SELL'
    ticker: text("ticker").notNull(),
    name: text("name").notNull(),
    quantity: integer("quantity").notNull(),
    price: real("price").notNull(),
    total: real("total").notNull(),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
});
