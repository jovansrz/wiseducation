// Alpha Vantage API Service for WISEducation
// API Key should be stored in environment variable in production

const ALPHA_VANTAGE_API_KEY = '7EXWBVIP5XF4C3GI';
const BASE_URL = 'https://www.alphavantage.co/query';

// Map Indonesian stock tickers to their global equivalents
// Alpha Vantage uses .JK suffix for Jakarta Stock Exchange
const TICKER_MAP: Record<string, string> = {
    'BBCA': 'BBCA.JK',
    'TLKM': 'TLKM.JK',
    'GOTO': 'GOTO.JK',
    'BMRI': 'BMRI.JK',
    'ASII': 'ASII.JK',
    'UNVR': 'UNVR.JK',
    'BBNI': 'BBNI.JK',
    'ANTM': 'ANTM.JK',
    'ADRO': 'ADRO.JK',
};

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

export interface AlphaVantageError {
    note?: string;
    information?: string;
}

/**
 * Fetch real-time quote for a stock from Alpha Vantage
 */
export async function getStockQuote(ticker: string): Promise<AlphaVantageQuote | null> {
    const globalTicker = TICKER_MAP[ticker] || ticker;

    try {
        const response = await fetch(
            `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${globalTicker}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );

        const data = await response.json();

        // Check for API rate limit or error messages
        if (data.Note || data.Information) {
            console.warn('Alpha Vantage API limit:', data.Note || data.Information);
            return null;
        }

        const quote = data['Global Quote'];
        if (!quote || Object.keys(quote).length === 0) {
            console.warn('No quote data for:', ticker);
            return null;
        }

        return {
            symbol: ticker,
            open: parseFloat(quote['02. open']) || 0,
            high: parseFloat(quote['03. high']) || 0,
            low: parseFloat(quote['04. low']) || 0,
            price: parseFloat(quote['05. price']) || 0,
            volume: parseFloat(quote['06. volume']) || 0,
            latestTradingDay: quote['07. latest trading day'] || '',
            previousClose: parseFloat(quote['08. previous close']) || 0,
            change: parseFloat(quote['09. change']) || 0,
            changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0,
        };
    } catch (error) {
        console.error('Error fetching stock quote:', error);
        return null;
    }
}

/**
 * Fetch quotes for multiple stocks
 * Note: Alpha Vantage free tier has 5 calls/minute, 500 calls/day limit
 * We batch requests with delays to avoid rate limiting
 */
export async function getMultipleQuotes(tickers: string[]): Promise<Map<string, AlphaVantageQuote>> {
    const results = new Map<string, AlphaVantageQuote>();

    for (const ticker of tickers) {
        const quote = await getStockQuote(ticker);
        if (quote) {
            results.set(ticker, quote);
        }
        // Add 12 second delay between calls to respect rate limit (5 calls/minute)
        if (tickers.indexOf(ticker) < tickers.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 12000));
        }
    }

    return results;
}

/**
 * Get available tickers that can be fetched
 */
export function getAvailableTickers(): string[] {
    return Object.keys(TICKER_MAP);
}
