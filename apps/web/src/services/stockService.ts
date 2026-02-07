import { api } from '../lib/api';

// Map Indonesian stock tickers to their global equivalents (Yahoo Finance style)
// Yahoo Finance uses .JK suffix for Jakarta Stock Exchange
const TICKER_MAP: Record<string, string> = {
    'BBCA': 'BBCA.JK',
    'TLKM': 'TLKM.JK',
    'GOTO': 'GOTO.JK',
    'BMRI': 'BMRI.JK',
    'ASII': 'ASII.JK',
    'UNVR': 'UNVR.JK',
    'BBNI': 'BBNI.JK',
    'BBRI': 'BBRI.JK',
    'ANTM': 'ANTM.JK',
    'ADRO': 'ADRO.JK',
    'INDF': 'INDF.JK',
    'ICBP': 'ICBP.JK',
};

// Re-exporting interfaces to match previous AlphaVantage structure
// to minimize refactoring in components
export interface AlphaVantageQuote {
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

export type StockQuote = AlphaVantageQuote;

export interface HistoricalDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export type TimePeriod = '1D' | '1W' | '1M' | '1Y';

/**
 * Fetch real-time quote for a stock from our backend (which uses Yahoo Finance)
 */
export async function getStockQuote(ticker: string): Promise<StockQuote | null> {
    const globalTicker = TICKER_MAP[ticker] || ticker;

    try {
        const response = await api.get<StockQuote>(`/stocks/quote?ticker=${globalTicker}`);
        // Ensure the returned symbol matches what the frontend expects (the short ticker)
        // gracefully handle if backend returns the long ticker
        const data = response.data;
        if (data && data.symbol === globalTicker) {
            data.symbol = ticker;
        }
        return data;
    } catch (error) {
        console.error(`Error fetching stock quote for ${ticker}:`, error);
        return null;
    }
}

/**
 * Fetch quotes for multiple stocks
 * We can now potentially parallelize this more aggressively since it's our own backend,
 * but let's keep it simple for now. 
 */
export async function getMultipleQuotes(tickers: string[]): Promise<Map<string, StockQuote>> {
    const results = new Map<string, StockQuote>();

    // We can run these in parallel
    const promises = tickers.map(async (ticker) => {
        const quote = await getStockQuote(ticker);
        if (quote) {
            return { ticker, quote };
        }
        return null;
    });

    const quotes = await Promise.all(promises);

    quotes.forEach(item => {
        if (item) {
            results.set(item.ticker, item.quote);
        }
    });

    return results;
}

/**
 * Get available tickers that can be fetched
 */
export function getAvailableTickers(): string[] {
    return Object.keys(TICKER_MAP);
}

/**
 * Fetch historical data from our backend
 */
export async function getHistoricalData(
    ticker: string,
    period: TimePeriod = '1M'
): Promise<HistoricalDataPoint[]> {
    const globalTicker = TICKER_MAP[ticker] || ticker;

    try {
        const response = await api.get<HistoricalDataPoint[]>(`/stocks/history?ticker=${globalTicker}&period=${period}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching historical data for ${ticker}:`, error);
        return [];
    }
}
