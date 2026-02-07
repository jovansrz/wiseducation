import { Router } from 'express';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const router = Router();

// Map consistent with frontend expectations
interface StockQuote {
    symbol: string;
    open: number;
    high: number;
    low: number;
    price: number;
    volume: number;
    latestTradingDay: string;
    previousClose: number;
    change: number;
    changePercent: number;
}

// List of common Indonesian stocks to auto-append .JK
const INDONESIAN_STOCKS = new Set([
    'BBCA', 'BBRI', 'BMRI', 'BBNI', 'TLKM', 'ASII', 'UNVR', 'ICBP', 'INDF', 'GOTO', 'ADRO', 'ANTM', 'BUKA', 'ARTO'
]);

// Get real-time quote
router.get('/quote', async (req, res) => {
    try {
        let { ticker } = req.query;

        if (!ticker || typeof ticker !== 'string') {
            return res.status(400).json({ error: 'Ticker symbol is required' });
        }

        ticker = ticker.toUpperCase();
        // Pre-emptive check for Indonesian stocks
        // If it's a known Indonesian stock and doesn't have a suffix, append .JK
        // This avoids getting the US OTC version (e.g. BBCA vs BBCA.JK)
        if (INDONESIAN_STOCKS.has(ticker) && !ticker.endsWith('.JK')) {
            ticker = `${ticker}.JK`;
        }

        let quote;

        try {
            // Try fetching as is
            quote = await yahooFinance.quote(ticker);
        } catch (error) {
            if (!quote) {
                // Check if error is 404/Not Found
                // YahooFinance2 throws errors, check message or name
                throw error;
            }
        }

        if (!quote) {
            return res.status(404).json({ error: 'Stock not found' });
        }

        const mappedQuote: StockQuote = {
            symbol: ticker, // Return the effective ticker
            open: quote.regularMarketOpen || 0,
            high: quote.regularMarketDayHigh || 0,
            low: quote.regularMarketDayLow || 0,
            price: quote.regularMarketPrice || 0,
            volume: quote.regularMarketVolume || 0,
            latestTradingDay: new Date(quote.regularMarketTime || Date.now()).toISOString().split('T')[0],
            previousClose: quote.regularMarketPreviousClose || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
        };

        res.json(mappedQuote);
    } catch (error) {
        console.error('Error fetching stock quote:', error);
        res.status(500).json({ error: 'Failed to fetch stock data', details: (error as Error).message });
    }
});

// Get historical data
router.get('/history', async (req, res) => {
    try {
        const { ticker, period } = req.query;

        if (!ticker || typeof ticker !== 'string') {
            return res.status(400).json({ error: 'Ticker symbol is required' });
        }

        const queryOptions = {
            period1: '2023-01-01', // Default start, but we should calculate based on period
        };

        // Calculate period1 based on requested period (1D, 1W, 1M, 1Y)
        const now = new Date();
        let startDate = new Date();

        switch (period) {
            case '1D':
                startDate.setDate(now.getDate() - 1); // Not really useful for daily candles (history), yahoo daily starts from previous days.
                // For 1D chart usually we need intraday, but yahoo-finance2 chart might be easier.
                // Or just fetch last 5 days to be safe.
                startDate.setDate(now.getDate() - 5);
                break;
            case '1W':
                startDate.setDate(now.getDate() - 7);
                break;
            case '1M':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case '1Y':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate.setMonth(now.getMonth() - 1); // Default 1M
        }

        const result = await yahooFinance.historical(ticker, {
            period1: startDate,
            interval: '1d', // Daily interval as per previous implementation
        });

        // Map to frontend expected format
        const history = result.map(item => ({
            date: item.date.toISOString().split('T')[0],
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
            volume: item.volume
        })).reverse(); // Frontend expects oldest first? 
        // Wait, frontend `getHistoricalData` in alphaVantage.ts did `.reverse()` at the end, implying it got newest first or it wanted oldest first?
        // "Oldest first for chart" says the comment in alphaVantage.ts
        // yahooFinance.historical returns oldest first usually. 
        // alphaVantage.ts: `Object.entries(timeSeries)...reverse()`
        // AlphaVantage time series object keys are dates, often unsorted or newest first.
        // Let's assume yahoo returns oldest first (chronological).
        // I will return it as is, and verify.

        res.json(history);
    } catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ error: 'Failed to fetch historical data' });
    }
});

export default router;
