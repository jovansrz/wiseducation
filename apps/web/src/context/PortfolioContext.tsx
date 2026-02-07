import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Types
export interface StockHolding {
    ticker: string;
    name: string;
    quantity: number; // In lots (1 lot = 100 shares)
    averagePrice: number;
    currentPrice: number;
}

export interface Transaction {
    id: string;
    type: 'BUY' | 'SELL';
    ticker: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
    timestamp: Date;
}

export interface PortfolioState {
    virtualCash: number;
    holdings: StockHolding[];
    transactions: Transaction[];
    totalValue?: number; // Optional, might be calculated on BE or FE
}

export interface PortfolioContextType extends PortfolioState {
    totalValue: number;
    totalProfit: number;
    buyStock: (ticker: string, name: string, quantity: number, price: number) => Promise<{ success: boolean; message: string }>;
    sellStock: (ticker: string, quantity: number, price: number) => Promise<{ success: boolean; message: string }>;
    updateHoldingPrice: (ticker: string, newPrice: number) => void;
    getHolding: (ticker: string) => StockHolding | undefined;
    resetPortfolio: () => Promise<void>;
    refreshPortfolio: () => Promise<void>;
    isLoading: boolean;
}

const defaultPortfolio: PortfolioState = {
    virtualCash: 10_000_000,
    holdings: [],
    transactions: [],
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

const API_Base = "http://localhost:3005"; // Hardcoded for now, ideally from env

export function PortfolioProvider({ children, userId }: { children: ReactNode; userId?: string }) {
    const [portfolio, setPortfolio] = useState<PortfolioState>(defaultPortfolio);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch portfolio from API
    // Fetch portfolio from API
    const fetchPortfolio = async () => {
        if (!userId) {
            setPortfolio(defaultPortfolio);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${API_Base}/api/portfolio?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch portfolio');
            const data = await response.json();

            // Transform data if needed, e.g. dates
            // Assuming API returns transaction dates as strings
            const transactions = data.transactions.map((t: any) => ({
                ...t,
                timestamp: new Date(t.timestamp)
            }));
            // BE returns holdings. we need to map to FE StockHolding
            // BE holding: { ticker, name, quantity, averagePrice }
            // FE needs currentPrice too, init with averagePrice or 0
            const holdings = data.holdings.map((h: any) => ({
                ...h,
                currentPrice: h.currentPrice || h.averagePrice // fallback
            }));

            setPortfolio({
                virtualCash: data.virtualCash,
                holdings,
                transactions
            });
        } catch (error) {
            console.error("Error loading portfolio:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, [userId]);

    // Calculate total holdings value
    const holdingsValue = portfolio.holdings.reduce(
        (sum, h) => sum + h.quantity * 100 * h.currentPrice, // quantity is in lots
        0
    );

    const totalValue = portfolio.virtualCash + holdingsValue;

    // Calculate total profit (current value vs initial investment 10M)
    // Actually totalProfit is Total Value - Initial Cash (10M)
    // Or simpler: Total Value - 10,000,000 (if no deposits/withdrawals)
    const totalProfit = totalValue - 10000000;


    const buyStock = async (ticker: string, name: string, quantity: number, price: number) => {
        if (!userId) return { success: false, message: "Please log in to trade" };

        try {
            const response = await fetch(`${API_Base}/api/portfolio/buy`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ticker, name, quantity, price })
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || result.message);

            // Refresh portfolio
            // To optimize, we could update local state manually, but fetching is safer for sync
            // Let's refetch for simplicity
            const refreshRes = await fetch(`${API_Base}/api/portfolio?userId=${userId}`);
            const data = await refreshRes.json();
            setPortfolio(prev => ({
                ...prev,
                virtualCash: data.virtualCash,
                holdings: data.holdings.map((h: any) => {
                    const existing = prev.holdings.find(ph => ph.ticker === h.ticker);
                    return { ...h, currentPrice: existing?.currentPrice || h.averagePrice };
                }),
                transactions: data.transactions.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }))
            }));

            return { success: true, message: result.message };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const sellStock = async (ticker: string, quantity: number, price: number) => {
        if (!userId) return { success: false, message: "Please log in to trade" };

        try {
            const response = await fetch(`${API_Base}/api/portfolio/sell`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, ticker, quantity, price })
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || result.message);

            // Refresh portfolio
            const refreshRes = await fetch(`${API_Base}/api/portfolio?userId=${userId}`);
            const data = await refreshRes.json();
            setPortfolio(prev => ({
                ...prev,
                virtualCash: data.virtualCash,
                holdings: data.holdings.map((h: any) => {
                    const existing = prev.holdings.find(ph => ph.ticker === h.ticker);
                    return { ...h, currentPrice: existing?.currentPrice || h.averagePrice };
                }),
                transactions: data.transactions.map((t: any) => ({ ...t, timestamp: new Date(t.timestamp) }))
            }));

            return { success: true, message: result.message };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    };

    const updateHoldingPrice = (ticker: string, newPrice: number) => {
        setPortfolio(prev => ({
            ...prev,
            holdings: prev.holdings.map(h =>
                h.ticker === ticker ? { ...h, currentPrice: newPrice } : h
            ),
        }));
    };

    const getHolding = (ticker: string) => {
        return portfolio.holdings.find(h => h.ticker === ticker);
    };

    const resetPortfolio = async () => {
        if (!userId) return;
        try {
            await fetch(`${API_Base}/api/portfolio/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });

            // Refetch
            const refreshRes = await fetch(`${API_Base}/api/portfolio?userId=${userId}`);
            const data = await refreshRes.json();
            setPortfolio({
                virtualCash: data.virtualCash,
                holdings: [],
                transactions: []
            });

        } catch (e) {
            console.error("Failed to reset", e);
        }
    };

    const refreshPortfolio = async () => {
        if (userId) {
            await fetchPortfolio();
        }
    };

    return (
        <PortfolioContext.Provider
            value={{
                ...portfolio,
                totalValue,
                totalProfit,
                buyStock,
                sellStock,
                updateHoldingPrice,
                getHolding,
                resetPortfolio,
                refreshPortfolio,
                isLoading
            }}
        >
            {children}
        </PortfolioContext.Provider>
    );
}

export function usePortfolio() {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
}
