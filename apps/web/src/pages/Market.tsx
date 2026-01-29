import React from 'react';
import { useNavigate } from 'react-router-dom';
import { stocks } from '../data/stocks';

export const Market: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            {/* Market Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-card-border bg-background-light dark:bg-background-dark shrink-0 gap-6">
                <div className="flex flex-1 items-center gap-8">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white hidden md:block whitespace-nowrap">Market Explorer</h2>
                    <div className="relative w-full max-w-lg hidden md:block">
                        <span className="absolute left-3 top-2.5 text-text-secondary material-symbols-outlined text-[20px]">search</span>
                        <input
                            className="w-full bg-background-light dark:bg-card-dark border border-card-border rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all placeholder-text-secondary"
                            placeholder="Search for stocks, ETFs, crypto..."
                            type="text"
                        />
                        <div className="absolute right-2 top-2 hidden lg:flex gap-1">
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-text-secondary bg-background-light dark:bg-background-dark border border-card-border rounded">Ctrl</kbd>
                            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold text-text-secondary bg-background-light dark:bg-background-dark border border-card-border rounded">K</kbd>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    <div className="flex h-9 items-center rounded-lg bg-background-light dark:bg-card-dark border border-card-border px-3 shadow-sm">
                        <span className="text-xs text-text-secondary mr-2">Virtual Cash:</span>
                        <span className="text-sm font-bold text-primary">$100,000</span>
                    </div>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-card-border text-text-secondary transition-colors relative">
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                    </button>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white shadow-lg cursor-pointer ml-2">
                        <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
                    {/* Tabs */}
                    <div className="border-b border-card-border">
                        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                            <a className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2" href="#">
                                <span className="material-symbols-outlined text-[18px]">candlestick_chart</span>
                                Stocks
                            </a>
                            <a className="border-transparent text-text-secondary hover:text-slate-900 dark:hover:text-white hover:border-card-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors" href="#">
                                <span className="material-symbols-outlined text-[18px]">currency_bitcoin</span>
                                Crypto
                            </a>
                            <a className="border-transparent text-text-secondary hover:text-slate-900 dark:hover:text-white hover:border-card-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors" href="#">
                                <span className="material-symbols-outlined text-[18px]">currency_exchange</span>
                                Forex
                            </a>
                            <a className="border-transparent text-text-secondary hover:text-slate-900 dark:hover:text-white hover:border-card-border whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors" href="#">
                                <span className="material-symbols-outlined text-[18px]">oil_barrel</span>
                                Commodities
                            </a>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">trending_up</span>
                                Trending Stocks
                            </h3>
                            <div className="flex bg-background-light dark:bg-card-dark rounded-lg p-1 border border-card-border">
                                <button className="px-3 py-1 rounded bg-white dark:bg-card-border text-xs font-bold text-slate-900 dark:text-white shadow-sm">Volume</button>
                                <button className="px-3 py-1 rounded text-text-secondary text-xs font-medium hover:text-slate-900 dark:hover:text-white transition-colors">Gainers</button>
                                <button className="px-3 py-1 rounded text-text-secondary text-xs font-medium hover:text-slate-900 dark:hover:text-white transition-colors">Losers</button>
                            </div>
                        </div>

                        {/* Stock Grid using Dynamic Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {stocks.map((stock) => {
                                const isPositive = stock.changePercent >= 0;
                                const isNeutral = stock.changePercent === 0;
                                const colorClass = isNeutral ? 'text-text-secondary' : isPositive ? 'text-primary' : 'text-red-500';
                                const bgIconClass = isNeutral ? 'bg-gray-200 dark:bg-gray-800' : isPositive ? 'bg-primary/20' : 'bg-red-500/20';
                                const textIconClass = isNeutral ? 'text-gray-500' : isPositive ? 'text-primary' : 'text-red-500';
                                const arrowIcon = isNeutral ? 'remove' : isPositive ? 'arrow_drop_up' : 'arrow_drop_down';
                                const sign = isPositive ? '+' : '';

                                return (
                                    <div
                                        key={stock.ticker}
                                        onClick={() => navigate(`/market/${stock.ticker}`)}
                                        className="bg-white dark:bg-card-dark rounded-xl border border-card-border p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="material-symbols-outlined text-text-secondary hover:text-primary">star</span>
                                        </div>
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border ${bgIconClass} ${textIconClass} border-current`}>
                                                {stock.ticker[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{stock.ticker}</h4>
                                                <span className="text-xs text-text-secondary">{stock.name}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-between mb-4">
                                            <div>
                                                <div className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stock.price.toLocaleString()}</div>
                                                <span className="text-xs text-text-secondary">IDR</span>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-sm font-bold ${colorClass} flex items-center justify-end`}>
                                                    <span className="material-symbols-outlined text-[16px]">{arrowIcon}</span>
                                                    {Math.abs(stock.changePercent).toFixed(2)}%
                                                </div>
                                                <span className={`text-xs ${colorClass}`}>{sign}{stock.changeValue.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {/* Simplified Sparkline / Chart Placeholder */}
                                        <div className="h-12 w-full">
                                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
                                                {isPositive ? (
                                                    <>
                                                        <path d="M0,25 Q25,28 50,15 T100,5" fill="none" stroke="#2ba094" strokeWidth="2"></path>
                                                        <path d="M0,25 Q25,28 50,15 T100,5 V30 H0 Z" fill="#2ba094" fillOpacity="0.1" stroke="none"></path>
                                                    </>
                                                ) : isNeutral ? (
                                                    <path d="M0,15 L100,15" fill="none" stroke="#a2b4b2" strokeWidth="2" strokeDasharray="4 2"></path>
                                                ) : (
                                                    <>
                                                        <path d="M0,5 Q25,10 50,20 T100,28" fill="none" stroke="#ef4444" strokeWidth="2"></path>
                                                        <path d="M0,5 Q25,10 50,20 T100,28 V30 H0 Z" fill="#ef4444" fillOpacity="0.1" stroke="none"></path>
                                                    </>
                                                )}
                                            </svg>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Bottom Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Gainers Table (Simplified Static) */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-card-border flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Top Gainers (24h)</h3>
                                    <button className="text-xs font-bold text-primary hover:text-teal-600">View All</button>
                                </div>
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-card-border">
                                        <tr className="hover:bg-background-light dark:hover:bg-card-border/30 transition-colors cursor-pointer">
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">BBNI</td>
                                            <td className="px-4 py-3 text-text-secondary text-xs">Bank Negara Indo...</td>
                                            <td className="px-4 py-3 text-right font-bold text-primary">+4.20%</td>
                                            <td className="px-4 py-3 text-right text-slate-900 dark:text-white">5,100</td>
                                        </tr>
                                        <tr className="hover:bg-background-light dark:hover:bg-card-border/30 transition-colors cursor-pointer">
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">ANTM</td>
                                            <td className="px-4 py-3 text-text-secondary text-xs">Aneka Tambang</td>
                                            <td className="px-4 py-3 text-right font-bold text-primary">+3.15%</td>
                                            <td className="px-4 py-3 text-right text-slate-900 dark:text-white">1,950</td>
                                        </tr>
                                        <tr className="hover:bg-background-light dark:hover:bg-card-border/30 transition-colors cursor-pointer">
                                            <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">ADRO</td>
                                            <td className="px-4 py-3 text-text-secondary text-xs">Adaro Energy</td>
                                            <td className="px-4 py-3 text-right font-bold text-primary">+2.88%</td>
                                            <td className="px-4 py-3 text-right text-slate-900 dark:text-white">2,850</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Market Sentiment */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border p-6 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Market Sentiment</h3>
                                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">BULLISH</span>
                                </div>
                                <div className="relative h-4 bg-background-light dark:bg-card-border rounded-full overflow-hidden mb-2">
                                    <div className="absolute left-0 top-0 h-full bg-red-500 w-[30%]"></div>
                                    <div className="absolute right-0 top-0 h-full bg-primary w-[70%]"></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-text-secondary mb-6">
                                    <span>30% Bearish</span>
                                    <span>70% Bullish</span>
                                </div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Today's Highlights</h4>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm">
                                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">arrow_upward</span>
                                        <span className="text-text-secondary">Technology sector leads the rally with <strong className="text-slate-900 dark:text-white">GOTO</strong> surging over 2%.</span>
                                    </li>
                                    <li className="flex gap-3 text-sm">
                                        <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">arrow_downward</span>
                                        <span className="text-text-secondary">Consumer goods face headwinds, <strong className="text-slate-900 dark:text-white">UNVR</strong> drops slightly.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
