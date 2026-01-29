import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { stocks } from '../data/stocks';

export const StockDetail: React.FC = () => {
    const { ticker } = useParams<{ ticker: string }>();
    const stock = stocks.find(s => s.ticker === ticker);

    if (!stock) {
        return <Navigate to="/market" />;
    }

    const isPositive = stock.changePercent >= 0;
    const isNeutral = stock.changePercent === 0;
    const colorClass = isNeutral ? 'text-text-secondary' : isPositive ? 'text-primary' : 'text-red-500';
    const arrowIcon = isNeutral ? 'remove' : isPositive ? 'arrow_drop_up' : 'arrow_drop_down';
    const sign = isPositive ? '+' : '';
    const candleColor = isPositive ? '#2ba094' : '#ef4444';

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
            {/* Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-card-border bg-background-light dark:bg-background-dark shrink-0">
                <div className="hidden md:flex items-center text-sm text-text-secondary">
                    <span>Market</span>
                    <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                    <span className="text-slate-900 dark:text-white font-medium">{stock.ticker} Stock Detail</span>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-xs text-text-secondary">Portfolio Value</span>
                        <span className="text-sm font-bold text-slate-900 dark:text-white">$102,450.00</span>
                    </div>
                    <div className="flex h-9 items-center rounded-lg bg-background-light dark:bg-card-dark border border-card-border px-3 shadow-sm">
                        <span className="text-xs text-text-secondary mr-2">Virtual Cash:</span>
                        <span className="text-sm font-bold text-primary">$100,000</span>
                    </div>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-card-border text-text-secondary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-card-border text-text-secondary transition-colors">
                        <span className="material-symbols-outlined text-[20px]">help</span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-lg cursor-pointer ml-2">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
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
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-background-light dark:bg-card-border text-text-secondary uppercase tracking-wide">Stock</span>
                            </div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">${stock.price.toLocaleString()}</span>
                                <span className={`text-lg font-medium ${colorClass} flex items-center`}>
                                    <span className="material-symbols-outlined text-lg mr-0.5">{arrowIcon}</span>
                                    {Math.abs(stock.changePercent)}% ({sign}${Math.abs(stock.changeValue)})
                                </span>
                                <span className="text-sm text-text-secondary ml-1">Today</span>
                            </div>
                        </div>
                        <div className="flex bg-background-light dark:bg-card-dark rounded-lg p-1 border border-card-border self-start md:self-end">
                            <button className="px-4 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-bold shadow-sm">1D</button>
                            <button className="px-4 py-1.5 rounded-md text-text-secondary text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">1W</button>
                            <button className="px-4 py-1.5 rounded-md text-text-secondary text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">1M</button>
                            <button className="px-4 py-1.5 rounded-md text-text-secondary text-sm font-medium hover:text-slate-900 dark:hover:text-white transition-colors">1Y</button>
                        </div>
                    </div>

                    {/* Chart & Investment Panel Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
                        {/* Chart Area */}
                        <div className="lg:col-span-2 bg-white dark:bg-card-dark rounded-xl border border-card-border p-4 flex flex-col shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex gap-4">
                                    <div className="flex gap-2 text-text-secondary">
                                        <span className="text-xs font-bold">O: <span className={colorClass}>{(stock.price * 0.99).toFixed(0)}</span></span>
                                        <span className="text-xs font-bold">H: <span className={colorClass}>{(stock.price * 1.02).toFixed(0)}</span></span>
                                        <span className="text-xs font-bold">L: <span className={colorClass}>{(stock.price * 0.98).toFixed(0)}</span></span>
                                        <span className="text-xs font-bold">C: <span className={colorClass}>{stock.price}</span></span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-1 hover:bg-background-light dark:hover:bg-card-border rounded text-text-secondary">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                    <button className="p-1 hover:bg-background-light dark:hover:bg-card-border rounded text-text-secondary">
                                        <span className="material-symbols-outlined text-[18px]">remove</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 w-full relative">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400">
                                    <defs>
                                        <pattern height="50" id="grid" patternUnits="userSpaceOnUse" width="100">
                                            <path d="M 100 0 L 0 0 0 50" fill="none" opacity="0.3" stroke="#2b3635" strokeWidth="1"></path>
                                        </pattern>
                                    </defs>
                                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                                    <path d="M0 280 C 100 270, 200 290, 300 250 S 500 200, 600 180 S 800 150, 800 150" fill="none" opacity="0.5" stroke="#a855f7" strokeWidth="2"></path>

                                    {/* Simplified Dynamic Candle Generation for Visual Rep */}
                                    {Array.from({ length: 18 }).map((_, i) => (
                                        <g key={i} transform={`translate(${50 + i * 40}, ${isPositive ? 250 - i * 5 : 50 + i * 10})`}>
                                            <line stroke={candleColor} strokeWidth="1" x1="10" x2="10" y1="-20" y2="40"></line>
                                            <rect fill={candleColor} height="30" width="20" x="0" y="0"></rect>
                                        </g>
                                    ))}

                                    {/* Helper Line */}
                                    <line stroke={candleColor} strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                                    <rect fill={candleColor} height="24" rx="4" width="70" x="730" y="38"></rect>
                                    <text fill="white" fontFamily="Lexend" fontSize="12" fontWeight="bold" textAnchor="middle" x="765" y="55">${stock.price}</text>
                                </svg>
                            </div>
                            {/* Volume Bars Mockup */}
                            <div className="h-16 w-full border-t border-card-border mt-2 pt-2 flex items-end justify-between px-[50px] opacity-50">
                                {Array.from({ length: 17 }).map((_, i) => (
                                    <div key={i} className={`w-4 ${i % 2 === 0 ? 'bg-primary/30' : 'bg-red-500/30'} rounded-t-sm`} style={{ height: `${Math.random() * 60 + 20}%` }}></div>
                                ))}
                            </div>
                        </div>

                        {/* Investment Panel */}
                        <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border shadow-sm flex flex-col">
                            <div className="flex border-b border-card-border">
                                <button className="flex-1 py-4 text-sm font-bold text-center text-primary border-b-2 border-primary bg-primary/5">
                                    BUY
                                </button>
                                <button className="flex-1 py-4 text-sm font-bold text-center text-text-secondary hover:text-red-500 hover:bg-red-500/5 transition-colors">
                                    SELL
                                </button>
                                <button className="flex-1 py-4 text-sm font-bold text-center text-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-card-dark/50 transition-colors">
                                    SWAP
                                </button>
                            </div>
                            <div className="p-6 flex flex-col gap-6 flex-1">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase">Order Type</label>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 rounded border border-primary bg-primary/10 text-primary text-sm font-bold">Limit</button>
                                        <button className="flex-1 py-2 rounded border border-card-border text-text-secondary hover:bg-background-light dark:hover:bg-card-border text-sm font-medium transition-colors">Market</button>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between">
                                            <label className="text-xs font-bold text-text-secondary uppercase">Quantity (Shares)</label>
                                            <span className="text-xs text-text-secondary">Max: 112</span>
                                        </div>
                                        <div className="relative">
                                            <input
                                                className="w-full bg-background-light dark:bg-background-dark border border-card-border rounded-lg py-3 px-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                type="number"
                                                defaultValue="100"
                                            />
                                            <span className="absolute right-4 top-3.5 text-xs font-bold text-text-secondary">Lots</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-text-secondary uppercase">Limit Price</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-slate-900 dark:text-white font-bold">$</span>
                                            <input
                                                className="w-full bg-background-light dark:bg-background-dark border border-card-border rounded-lg py-3 px-4 pl-8 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                                type="number"
                                                defaultValue={stock.price}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="w-full bg-card-border h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full w-[45%]"></div>
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
                                        <span className="text-sm text-text-secondary">Estimated Cost</span>
                                        <span className="text-xl font-bold text-slate-900 dark:text-white">${(stock.price * 100).toLocaleString()}</span>
                                    </div>
                                    <button className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-sm tracking-wide shadow-lg shadow-primary/20 transition-all transform active:scale-[0.98]">
                                        EXECUTE TRADE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Stats & News */}
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

                        {/* Latest News */}
                        <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-card-border flex justify-between items-center bg-background-light/50 dark:bg-card-border/20">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[20px] text-primary">newspaper</span>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Latest News</h3>
                                </div>
                                <a className="text-xs text-primary font-bold hover:text-primary-dark transition-colors" href="#">View All</a>
                            </div>
                            <div className="flex-1 overflow-y-auto max-h-[400px] p-0 divide-y divide-card-border">
                                <div className="p-4 hover:bg-background-light dark:hover:bg-card-border/30 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">Earnings</span>
                                        <span className="text-[10px] text-text-secondary">2h ago</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{stock.ticker} Reports Growth</h4>
                                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{stock.name} continues its strong performance driven by recent strategic initiatives...</p>
                                </div>
                                <div className="p-4 hover:bg-background-light dark:hover:bg-card-border/30 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-2 py-0.5 rounded">Digital</span>
                                        <span className="text-[10px] text-text-secondary">5h ago</span>
                                    </div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">New Digital Innovation</h4>
                                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">The company innovates with new features targeting younger demographics.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
