import { Router } from "express";
import { stockService } from "../services/stock.service.js";

const router = Router();

router.get("/stocks", async (req, res) => {
    const stocks = await stockService.getAllStocks();
    res.json(stocks);
});

router.get("/stocks/search", async (req, res) => {
    const query = req.query.q as string;
    if (!query) {
        res.status(400).json({ message: "Query parameter 'q' is required" });
        return;
    }
    const results = await stockService.searchStocks(query);
    res.json(results);
});

router.get("/stocks/:ticker", async (req, res) => {
    const stock = await stockService.getStockByTicker(req.params.ticker);
    if (!stock) {
        res.status(404).json({ message: "Stock not found" });
        return;
    }
    res.json(stock);
});

export default router;
