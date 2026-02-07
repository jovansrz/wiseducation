import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRealTimeStocks } from '../hooks/useRealTimeStocks';
import { usePortfolio } from '../context/PortfolioContext';
import { getHistoricalData, type TimePeriod, type HistoricalDataPoint } from '../services/stockService';

export const StockDetail: React.FC = () => {
    const { ticker } = useParams<{ ticker: string }>();
    const { stocks } = useRealTimeStocks();
    const { virtualCash, totalValue, buyStock, sellStock, getHolding, transactions } = usePortfolio();

    const [orderType, setOrderType] = useState<'BUY' | 'SELL'>('BUY');
    const [limitType, setLimitType] = useState<'Limit' | 'Market'>('Market');
    const [quantity, setQuantity] = useState<number>(1);
    const [limitPrice, setLimitPrice] = useState<number>(0);
    const [tradeMessage, setTradeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Time period and historical data state
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1D');
    const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
    const [isLoadingChart, setIsLoadingChart] = useState(false);

    const stock = stocks.find(s => s.ticker === ticker);
    const holding = ticker ? getHolding(ticker) : undefined;

    // Fetch historical data when ticker or period changes
    const fetchHistoricalData = useCallback(async () => {
        if (!ticker) return;
        setIsLoadingChart(true);
        try {
            const data = await getHistoricalData(ticker, selectedPeriod);
            setHistoricalData(data);
        } catch (error) {
            console.error('Failed to fetch historical data:', error);
        } finally {
            setIsLoadingChart(false);
        }
    }, [ticker, selectedPeriod]);

    useEffect(() => {
        fetchHistoricalData();
    }, [fetchHistoricalData]);

    // Generate line chart path from historical data or price history
    const chartPath = useMemo(() => {
        const prices = historicalData.length > 0
            ? historicalData.map(d => d.close)
            : stock?.priceHistory || [];

        if (prices.length < 2) return '';

        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min || 1;
        const width = 760;
        const height = 320;
        const padding = 20;

        const points = prices.map((price, i) => {
            const x = padding + (i / (prices.length - 1)) * (width - padding * 2);
            const y = padding + (height - padding * 2) - ((price - min) / range) * (height - padding * 2);
            return `${x},${y}`;
        });

        return `M${points.join(' L')}`;
    }, [historicalData, stock?.priceHistory]);

    // Generate area fill path
    const areaPath = useMemo(() => {
        if (!chartPath) return '';
        return `${chartPath} L760,320 L20,320 Z`;
    }, [chartPath]);

    // Get recent transactions for this stock
    const stockTransactions = useMemo(() =>
        transactions.filter(t => t.ticker === ticker).slice(0, 5),
        [transactions, ticker]
    );

    if (!stock) {
        return <Navigate to="/market" />;
    }

    const isPositive = stock.changePercent >= 0;
    const isNeutral = stock.changePercent === 0;
    const colorClass = isNeutral ? 'text-text-secondary' : isPositive ? 'text-primary' : 'text-red-500';
    const arrowIcon = isNeutral ? 'remove' : isPositive ? 'arrow_drop_up' : 'arrow_drop_down';
    const sign = isPositive ? '+' : '';
    const lineColor = isPositive ? '#2ba094' : '#ef4444';

    const currentPrice = limitType === 'Market' ? stock.price : limitPrice || stock.price;
    const totalCost = quantity * 100 * currentPrice; // 1 lot = 100 shares
    const maxBuyLots = Math.floor(virtualCash / (currentPrice * 100));
    const maxSellLots = holding?.quantity || 0;

    const handleTrade = async () => {
        if (quantity <= 0) {
            setTradeMessage({ type: 'error', text: 'Enter a valid quantity' });
            return;
        }

        let result;
        if (orderType === 'BUY') {
            result = await buyStock(stock.ticker, stock.name, quantity, currentPrice);
        } else {
            result = await sellStock(stock.ticker, quantity, currentPrice);
        }

        setTradeMessage({ type: result.success ? 'success' : 'error', text: result.message });

        if (result.success) {
            setQuantity(1);
            setTimeout(() => setTradeMessage(null), 3000);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(Math.round(value));
    };

    const percentOfMax = orderType === 'BUY'
        ? maxBuyLots > 0 ? (quantity / maxBuyLots) * 100 : 0
        : maxSellLots > 0 ? (quantity / maxSellLots) * 100 : 0;

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-card-border bg-background-light dark:bg-background-dark shrink-0">
                <div className="hidden md:flex items-center text-sm text-text-secondary">
                    <span>Simulation</span>
                    <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{stock.ticker} Detail</span>
                    {stock.isLive && (
                        <span className="ml-2 flex items-center gap-1 text-primary">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-[10px] font-medium">LIVE</span>
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-xs text-text-secondary">Total Portfolio</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">Rp {formatCurrency(totalValue)}</span>
                    </div>
                    <div className="flex h-9 items-center rounded-lg bg-background-light dark:bg-card-dark border border-card-border px-3 shadow-sm">
                        <span className="text-xs text-text-secondary mr-2">WISE CASH:</span>
                        <span className="text-sm font-bold text-primary">Rp {formatCurrency(virtualCash)}</span>
                    </div>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-card-border text-text-secondary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-card-border text-text-secondary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
                    {/* Top Info */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stock.name} ({stock.ticker})</h2>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background-light dark:bg-card-border text-text-secondary uppercase tracking-wide">IDX Stock</span>
                                {holding && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase tracking-wide">
                                        Owned: {holding.quantity} lots
                                    </span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Rp {formatCurrency(stock.price)}</span>
                                <span className={`text-lg font-medium ${colorClass} flex items-center`}>
                                    <span className="material-symbols-outlined text-lg mr-0.5">{arrowIcon}</span>
                                    {Math.abs(stock.changePercent).toFixed(2)}% ({sign}Rp {formatCurrency(Math.abs(stock.changeValue))})
                                </span>
                                <span className="text-sm text-text-secondary ml-1">Today</span>
                            </div>
                        </div>
                        <div className="flex bg-background-light dark:bg-card-dark rounded-lg p-1 border border-card-border self-start md:self-end">
                            {(['1D', '1W', '1M', '1Y'] as TimePeriod[]).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${selectedPeriod === period
                                        ? 'bg-primary/10 text-primary shadow-sm'
                                        : 'text-text-secondary hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart & Investment Panel Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 bg-white dark:bg-card-dark rounded-xl border border-card-border p-4 flex flex-col shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex gap-4">
                                    <div className="flex gap-2 text-text-secondary">
                                        <span className="text-xs font-bold">O: <span className={colorClass}>{formatCurrency(stock.price * 0.99)}</span></span>
                                        <span className="text-xs font-bold">H: <span className={colorClass}>{formatCurrency(stock.price * 1.02)}</span></span>
                                        <span className="text-xs font-bold">L: <span className={colorClass}>{formatCurrency(stock.price * 0.98)}</span></span>
                                        <span className="text-xs font-bold">C: <span className={colorClass}>{formatCurrency(stock.price)}</span></span>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center">
                                    {isLoadingChart && (
                                        <span className="text-xs text-text-secondary flex items-center gap-1">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                                            Loading...
                                        </span>
                                    )}
                                    <button className="p-1 hover:bg-background-light dark:hover:bg-card-border rounded text-text-secondary">
                                        <span className="material-symbols-outlined text-[18px]">refresh</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 w-full relative min-h-[350px]">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400">
                                    <defs>
                                        <pattern height="50" id="grid" patternUnits="userSpaceOnUse" width="100">
                                            <path d="M 100 0 L 0 0 0 50" fill="none" opacity="0.3" stroke="#2b3635" strokeWidth="1"></path>
                                        </pattern>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor={lineColor} stopOpacity="0.3" />
                                            <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
                                        </linearGradient>
                                    </defs>
                                    <rect fill="url(#grid)" height="100%" width="100%"></rect>

                                    {/* Area fill under line */}
                                    {areaPath && (
                                        <path
                                            d={areaPath}
                                            fill="url(#lineGradient)"
                                            stroke="none"
                                        />
                                    )}

                                    {/* Main line chart */}
                                    {chartPath && (
                                        <path
                                            d={chartPath}
                                            fill="none"
                                            stroke={lineColor}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    )}

                                    {/* Current price line */}
                                    <line stroke={lineColor} strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                                    <rect fill={lineColor} height="24" rx="4" width="100" x="700" y="38"></rect>
                                    <text fill="white" fontFamily="Lexend" fontSize="12" fontWeight="bold" textAnchor="middle" x="750" y="55">Rp {formatCurrency(stock.price)}</text>

                                    {/* No data message */}
                                    {!chartPath && !isLoadingChart && (
                                        <text fill="#6b7280" fontSize="14" textAnchor="middle" x="400" y="200">
                                            Chart data will load momentarily...
                                        </text>
                                    )}
                                </svg>
                            </div>
                            {/* Volume Bars */}
                            <div className="h-16 w-full border-t border-card-border mt-2 pt-2 flex items-end justify-between px-[20px] opacity-50">
                                {historicalData.length > 0 ? (
                                    historicalData.map((data, i) => {
                                        const maxVolume = Math.max(...historicalData.map(d => d.volume));
                                        const heightPercent = (data.volume / maxVolume) * 80 + 20;
                                        const isUp = data.close >= data.open;
                                        return (
                                            <div
                                                key={i}
                                                className={`w-3 ${isUp ? 'bg-primary/40' : 'bg-red-500/40'} rounded-t-sm transition-all`}
                                                style={{ height: `${heightPercent}%` }}
                                            ></div>
                                        );
                                    })
                                ) : (
                                    Array.from({ length: 20 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-3 ${i % 2 === 0 ? 'bg-primary/40' : 'bg-red-500/40'} rounded-t-sm`}
                                            style={{ height: `${Math.random() * 60 + 20}%` }}
                                        ></div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Investment Panel */}
                        <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border shadow-sm flex flex-col">
                            <div className="flex border-b border-card-border">
                                <button
                                    onClick={() => setOrderType('BUY')}
                                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${orderType === 'BUY' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-text-secondary hover:text-primary hover:bg-primary/5'}`}
                                >
                                    BUY
                                </button>
                                <button
                                    onClick={() => setOrderType('SELL')}
                                    className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${orderType === 'SELL' ? 'text-red-500 border-b-2 border-red-500 bg-red-500/5' : 'text-text-secondary hover:text-red-500 hover:bg-red-500/5'}`}
                                >
                                    SELL
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-6 flex-1">
                                {/* Trade Message */}
                                {tradeMessage && (
                                    <div className={`p-3 rounded-lg text-sm font-medium ${tradeMessage.type === 'success' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                                        {tradeMessage.text}
                                    </div>
                                )}

                                {/* Current Holdings */}
                                {holding && (
                                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-text-secondary">Your Position</span>
                                            <span className="text-sm font-bold text-primary">{holding.quantity} lots</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-text-secondary">Avg Price</span>
                                            <span className="text-sm text-slate-900 dark:text-white">Rp {formatCurrency(holding.averagePrice)}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase">Order Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setLimitType('Market')}
                                            className={`flex-1 py-2 rounded border text-sm font-bold transition-colors ${limitType === 'Market' ? 'border-primary bg-primary/10 text-primary' : 'border-card-border text-text-secondary hover:bg-background-light dark:hover:bg-card-border'}`}
                                        >
                                            Market
                                        </button>
                                        <button
                                            onClick={() => { setLimitType('Limit'); setLimitPrice(stock.price); }}
                                            className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${limitType === 'Limit' ? 'border-primary bg-primary/10 text-primary' : 'border-card-border text-text-secondary hover:bg-background-light dark:hover:bg-card-border'}`}
                                        >
                                            Limit
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-text-secondary uppercase">Quantity (Lots)</label>
                                            <span className="text-xs text-text-secondary">
                                                Max: {orderType === 'BUY' ? maxBuyLots : maxSellLots} lots
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-background-light dark:bg-background-dark border border-card-border rounded-lg py-3 px-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                type="number"
                                                min="1"
                                                max={orderType === 'BUY' ? maxBuyLots : maxSellLots}
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                                            />
                                            <span className="absolute right-4 top-3.5 text-xs font-bold text-text-secondary">Lots</span>
                                        </div>
                                        <p className="text-[10px] text-text-secondary">1 lot = 100 shares</p>
                                    </div>
                                    {limitType === 'Limit' && (
                                        <div className="flex flex-col gap-2">
                                            <label className="text-xs font-bold text-text-secondary uppercase">Limit Price</label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-3.5 text-slate-900 dark:text-white font-bold">Rp</span>
                                                <input
                                                    className="w-full bg-background-light dark:bg-background-dark border border-card-border rounded-lg py-3 px-4 pl-12 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                    type="number"
                                                    value={limitPrice}
                                                    onChange={(e) => setLimitPrice(Math.max(0, parseInt(e.target.value) || 0))}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${orderType === 'BUY' ? 'bg-primary' : 'bg-red-500'}`}
                                            style={{ width: `${Math.min(100, percentOfMax)}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-text-secondary font-bold">
                                        <span>0%</span>
                                        <span>25%</span>
                                        <span>50%</span>
                                        <span>75%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                                <div className="mt-auto pt-6 border-t border-card-border flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-text-secondary">{orderType === 'BUY' ? 'Total Cost' : 'Total Proceeds'}</span>
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">Rp {formatCurrency(totalCost)}</span>
                                    </div>
                                    <button
                                        onClick={handleTrade}
                                        disabled={(orderType === 'BUY' && totalCost > virtualCash) || (orderType === 'SELL' && quantity > maxSellLots) || quantity <= 0}
                                        className={`w-full py-3.5 rounded-lg font-bold text-sm tracking-wide transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${orderType === 'BUY'
                                            ? 'bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/20'
                                            : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                                            }`}
                                    >
                                        {orderType === 'BUY' ? 'BUY' : 'SELL'} {stock.ticker}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats & Transactions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-card-border flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <span className="material-symbols-outlined text-[16px]">pie_chart</span>
                                        <p className="text-xs uppercase font-bold">Market Cap</p>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stock.marketCap}</p>
                                </div>
                                <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-card-border flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <span className="material-symbols-outlined text-[16px]">monitoring</span>
                                        <p className="text-xs uppercase font-bold">P/E Ratio</p>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stock.peRatio}</p>
                                </div>
                                <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-card-border flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <span className="material-symbols-outlined text-[16px]">savings</span>
                                        <p className="text-xs uppercase font-bold">Div. Yield</p>
                                    </div>
                                    <p className="text-lg font-bold text-primary">{stock.divYield}</p>
                                </div>
                                <div className="bg-white dark:bg-card-dark p-4 rounded-xl border border-card-border flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <span className="material-symbols-outlined text-[16px]">bar_chart</span>
                                        <p className="text-xs uppercase font-bold">Avg Vol (3m)</p>
                                    </div>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">{stock.volume}</p>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-card-border flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">About {stock.name}</h3>
                                    <span className="px-2 py-1 rounded bg-background-light dark:bg-card-border text-xs font-medium text-text-secondary">{stock.sector} Sector</span>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {stock.description}
                                </p>
                                <div className="mt-4 flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">CEO</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{stock.ceo}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Founded</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{stock.founded}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-text-secondary">Employees</span>
                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{stock.employees}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Your Transactions */}
                        <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-card-border flex justify-between items-center bg-background-light/50 dark:bg-card-border/20">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Your Transactions</h3>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[400px] p-0 divide-y divide-card-border">
                                {stockTransactions.length > 0 ? (
                                    stockTransactions.map(tx => (
                                        <div key={tx.id} className="p-4 hover:bg-background-light dark:hover:bg-card-border/30 transition-colors">
                                            <div className="flex justify-between items-start mb-1.5">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tx.type === 'BUY' ? 'text-primary bg-primary/10' : 'text-red-500 bg-red-500/10'}`}>
                                                    {tx.type}
                                                </span>
                                                <span className="text-[10px] text-text-secondary">
                                                    {new Date(tx.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                                                {tx.quantity} lots @ Rp {formatCurrency(tx.price)}
                                            </h4>
                                            <p className="text-xs text-text-secondary">
                                                Total: Rp {formatCurrency(tx.total)}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <span className="material-symbols-outlined text-3xl text-text-secondary mb-2">history</span>
                                        <p className="text-text-secondary text-sm">No transactions yet</p>
                                        <p className="text-text-secondary text-xs mt-1">Start investing to see your history</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
