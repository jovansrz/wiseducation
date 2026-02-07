import { useState, useEffect, useCallback, useRef } from 'react';
import { stocks as initialStocks, type Stock } from '../data/stocks';
import { getStockQuote, type AlphaVantageQuote } from '../services/stockService';

export interface RealTimeStock extends Stock {
    isLive: boolean;
    lastUpdate: Date | null;
    priceHistory: number[];
}

interface UseRealTimeStocksReturn {
    stocks: RealTimeStock[];
    isLoading: boolean;
    lastApiUpdate: Date | null;
    refreshStock: (ticker: string) => Promise<void>;
    refreshAll: () => Promise<void>;
}

// Backend uses Yahoo Finance, so we can fetch more frequently
const PRICE_SIMULATION_INTERVAL = 3000; // 3 seconds for simulated fluctuations between real updates

/**
 * Custom hook for real-time stock data with Alpha Vantage integration
 * Uses real API data when available, with simulated fluctuations between updates
 */
export function useRealTimeStocks(): UseRealTimeStocksReturn {
    const [stocks, setStocks] = useState<RealTimeStock[]>(() =>
        initialStocks.map(s => ({
            ...s,
            isLive: false,
            lastUpdate: null,
            priceHistory: [s.price],
        }))
    );
    const [isLoading, setIsLoading] = useState(false);
    const [lastApiUpdate, setLastApiUpdate] = useState<Date | null>(null);
    const currentTickerIndex = useRef(0);
    const isMounted = useRef(true);

    // Apply real API quote to stock data
    const applyQuoteToStock = useCallback((quote: AlphaVantageQuote) => {
        setStocks(prev =>
            prev.map(s => {
                if (s.ticker !== quote.symbol) return s;

                const newPrice = quote.price > 0 ? quote.price : s.price;
                const newHistory = [...s.priceHistory.slice(-19), newPrice]; // Keep last 20 prices

                return {
                    ...s,
                    price: newPrice,
                    changePercent: quote.changePercent,
                    changeValue: quote.change,
                    isLive: true,
                    lastUpdate: new Date(),
                    priceHistory: newHistory,
                };
            })
        );
    }, []);

    // Fetch a single stock from Alpha Vantage
    const refreshStock = useCallback(async (ticker: string) => {
        setIsLoading(true);
        try {
            const quote = await getStockQuote(ticker);
            if (quote && isMounted.current) {
                applyQuoteToStock(quote);
                setLastApiUpdate(new Date());
            }
        } catch (error) {
            console.error(`Error fetching ${ticker}:`, error);
        } finally {
            if (isMounted.current) {
                setIsLoading(false);
            }
        }
    }, [applyQuoteToStock]);

    // Refresh all stocks (used on initial load)
    const refreshAll = useCallback(async () => {
        setIsLoading(true);
        for (const stock of initialStocks) {
            if (!isMounted.current) break;
            await refreshStock(stock.ticker);
            // Wait between calls to respect rate limit
            // Small delay to prevent flooding if we have many stocks
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        setIsLoading(false);
    }, [refreshStock]);

    // Rotate through stocks, fetching one every interval
    useEffect(() => {
        isMounted.current = true;

        // Fetch first stock immediately
        const firstTicker = initialStocks[0]?.ticker;
        if (firstTicker) {
            refreshStock(firstTicker);
        }

        // Set up rotation for subsequent stocks
        const apiInterval = setInterval(() => {
            if (document.hidden) return; // Pause polling when tab is inactive

            currentTickerIndex.current = (currentTickerIndex.current + 1) % initialStocks.length;
            const ticker = initialStocks[currentTickerIndex.current]?.ticker;
            if (ticker) {
                refreshStock(ticker);
            }
        }, 5000); // Increased to 5 seconds

        return () => {
            isMounted.current = false;
            clearInterval(apiInterval);
        };
    }, [refreshStock]);

    // Simulate small price fluctuations between API updates for a more dynamic feel
    useEffect(() => {
        const simulationInterval = setInterval(() => {
            setStocks(prev =>
                prev.map(s => {
                    // Small random walk: ±0.1% to ±0.3% fluctuation
                    const fluctuation = (Math.random() - 0.5) * 0.006;
                    const newPrice = Math.round(s.price * (1 + fluctuation));
                    const priceDiff = newPrice - (s.priceHistory[0] || s.price);
                    const percentChange = ((priceDiff / (s.priceHistory[0] || s.price)) * 100);

                    return {
                        ...s,
                        price: newPrice,
                        changeValue: priceDiff,
                        changePercent: parseFloat(percentChange.toFixed(2)),
                        priceHistory: [...s.priceHistory.slice(-19), newPrice],
                    };
                })
            );
        }, PRICE_SIMULATION_INTERVAL);

        return () => clearInterval(simulationInterval);
    }, []);

    return {
        stocks,
        isLoading,
        lastApiUpdate,
        refreshStock,
        refreshAll,
    };
}
