import React from 'react';
import { NavLink } from 'react-router-dom';

export const AIAssistant: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white overflow-hidden h-screen flex">
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0 h-full">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-text-secondary hover:text-white">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold text-white tracking-tight">WISE AI Assistant</h2>
                            <div className="flex items-center gap-2">
                                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-xs font-medium text-primary">Online • v2.4</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:flex items-center justify-center size-9 rounded-full bg-stone-800 text-text-secondary hover:text-white hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                        </button>
                        <NavLink to="/" className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-800 hover:bg-red-500/10 hover:text-red-400 text-text-secondary text-sm font-medium rounded-lg transition-all border border-transparent hover:border-red-500/20">
                            <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
                            <span className="hidden sm:inline">End Session</span>
                        </NavLink>
                    </div>
                </header>
                {/* Chat Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 scroll-smooth" id="chat-container">
                    {/* Date Separator */}
                    <div className="flex justify-center">
                        <span className="px-3 py-1 bg-stone-800 rounded-full text-xs font-medium text-text-secondary">Today, 10:23 AM</span>
                    </div>
                    {/* Intro Message */}
                    <div className="flex items-start gap-4 max-w-3xl">
                        <div className="shrink-0 rounded-full size-10 bg-primary/20 flex items-center justify-center text-primary shadow-sm" data-alt="AI Avatar">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-text-secondary font-medium ml-1">WISE AI</span>
                            <div className="bg-stone-800 text-gray-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm text-sm sm:text-base leading-relaxed max-w-prose">
                                <p>Hello Rizky! I'm ready to assist with your portfolio analysis or market research. What's on your mind today?</p>
                            </div>
                        </div>
                    </div>
                    {/* User Message */}
                    <div className="flex items-end justify-end gap-3">
                        <div className="flex flex-col gap-1 items-end max-w-[85%] sm:max-w-[70%]">
                            <div className="bg-primary text-white rounded-2xl rounded-tr-none px-5 py-3.5 shadow-md text-sm sm:text-base leading-relaxed">
                                <p>Analyze BBCA stock for me. Is it a good time to buy?</p>
                            </div>
                            <span className="text-[11px] text-text-secondary mr-1">10:24 AM</span>
                        </div>
                        <div className="shrink-0 bg-center bg-no-repeat bg-cover rounded-full size-8" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBe3r_RMHJoYeezlq2qiFdYv_x0Kwc4lNMsZuKH2GSRxSVKxfmnO8Sos1MW1WCdmbZBeM0tGCvTerGOQQewZ-nv7Vkpp_LnVp4bkUGdlQMLaz2UjiUE1uIuRyES9aNJAvcHa0mmivjLKgxnvXl4kLbosViloUiyK5PWaEBLGiPfjPaDW3APO11GdFoZvxpX1mn9LIVvn1hJniZK6ByZYkIOgaGuxS_QvW-OJARPDHZNuOkVyesfoqWu8Fr-ERgAD9b2bd8b9ZgAKsM')" }}></div>
                    </div>
                    {/* AI Response with Chart */}
                    <div className="flex items-start gap-4 w-full max-w-4xl">
                        <div className="shrink-0 rounded-full size-10 bg-primary/20 flex items-center justify-center text-primary shadow-sm mt-1">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div className="flex flex-col gap-3 w-full min-w-0">
                            <span className="text-xs text-text-secondary font-medium ml-1">WISE AI</span>
                            {/* Text Response */}
                            <div className="bg-stone-800 text-gray-100 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm text-sm sm:text-base leading-relaxed max-w-prose">
                                <p>Here is the technical analysis for <strong className="text-white">Bank Central Asia (BBCA)</strong>. The stock is currently showing a strong bullish trend, having just broken through a key resistance level at 9,200.</p>
                            </div>
                            {/* Chart Card Component */}
                            <div className="bg-stone-800/50 border border-white/5 rounded-2xl p-5 w-full sm:w-[500px] shadow-lg">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-white font-semibold text-lg">Bank Central Asia Tbk</h3>
                                        <p className="text-text-secondary text-sm">IDX: BBCA</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white tracking-tight">Rp 9,275</p>
                                        <div className="flex items-center justify-end gap-1 text-[#0bda4d]">
                                            <span className="material-symbols-outlined text-sm">trending_up</span>
                                            <span className="text-sm font-bold">+1.2% (1D)</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Chart Visualization */}
                                <div className="relative h-[180px] w-full mb-4 group cursor-crosshair">
                                    <svg className="overflow-visible" fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 478 150" width="100%">
                                        <defs>
                                            <linearGradient gradientUnits="userSpaceOnUse" id="chart-gradient" x1="239" x2="239" y1="0" y2="150">
                                                <stop stopColor="#2b9c91" stopOpacity="0.2"></stop>
                                                <stop offset="1" stopColor="#2b9c91" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.61 41C90.77 41 90.77 93 108.9 93C127.08 93 127.08 33 145.2 33C163.38 33 163.38 101 181.5 101C199.69 101 199.69 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.0 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25V149H0V109Z" fill="url(#chart-gradient)"></path>
                                        <path d="M0 109C18.15 109 18.15 21 36.3 21C54.46 21 54.46 41 72.61 41C90.77 41 90.77 93 108.9 93C127.08 93 127.08 33 145.2 33C163.38 33 163.38 101 181.5 101C199.69 101 199.69 61 217.8 61C236 61 236 45 254.1 45C272.3 45 272.3 121 290.4 121C308.6 121 308.6 149 326.7 149C344.9 149 344.9 1 363.0 1C381.2 1 381.2 81 399.3 81C417.5 81 417.5 129 435.6 129C453.8 129 453.8 25 472 25" stroke="#2b9c91" strokeLinecap="round" strokeWidth="2.5"></path>
                                    </svg>
                                </div>
                                <div className="flex justify-between text-xs text-text-secondary font-medium px-1">
                                    <span>09:00</span>
                                    <span>10:30</span>
                                    <span>12:00</span>
                                    <span>13:30</span>
                                    <span>15:00</span>
                                </div>
                                {/* Mini Actions */}
                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors border border-white/5">
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        Watchlist
                                    </button>
                                    <button className="flex items-center justify-center gap-2 py-2 rounded-lg bg-primary hover:bg-primary-dark text-sm font-medium text-white transition-colors shadow-lg shadow-primary/20">
                                        <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                                        Buy BBCA
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Input Area */}
                <div className="p-4 sm:p-6 bg-background-dark/95 backdrop-blur z-10 w-full max-w-5xl mx-auto">
                    {/* Quick Action Chips */}
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 border border-white/5 hover:border-primary/50 hover:bg-stone-800/80 text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition-all whitespace-nowrap">
                            <span className="text-primary">📈</span> Technical Analysis
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 border border-white/5 hover:border-primary/50 hover:bg-stone-800/80 text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition-all whitespace-nowrap">
                            <span className="text-yellow-400">💡</span> Investment Tips
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 border border-white/5 hover:border-primary/50 hover:bg-stone-800/80 text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition-all whitespace-nowrap">
                            <span className="text-blue-400">📰</span> Latest News
                        </button>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 border border-white/5 hover:border-primary/50 hover:bg-stone-800/80 text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition-all whitespace-nowrap">
                            <span className="text-purple-400">📊</span> Financials
                        </button>
                    </div>
                    {/* Input Bar */}
                    <div className="relative flex items-end gap-2 bg-stone-800 rounded-xl border border-white/10 p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-lg">
                        <button className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0" title="Attach file">
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <textarea className="w-full bg-transparent border-none text-white placeholder-text-secondary focus:ring-0 resize-none py-2.5 max-h-32 min-h-[44px]" placeholder="Ask WISE about stocks, trends, or definitions..." rows={1} style={{ fieldSizing: "content" } as any}></textarea>
                        <div className="flex gap-1 shrink-0 pb-0.5">
                            <button className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors" title="Voice Input">
                                <span className="material-symbols-outlined">mic</span>
                            </button>
                            <button className="p-2 bg-primary hover:bg-primary-dark text-white rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center">
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-text-secondary mt-3 opacity-60">WISE AI can make mistakes. Consider checking important financial information.</p>
                </div>
            </main>
        </div>
    );
};
