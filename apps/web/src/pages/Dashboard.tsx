import React from 'react';

export const Dashboard: React.FC = () => {
    return (
        <>
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Good Morning, Rizky! 👋</h2>
                <p className="text-text-secondary">The market is bullish today. Your portfolio grew by <span className="text-green-500 font-medium">+2.4%</span> since yesterday.</p>
            </div>

            {/* Top Grid: Quick Actions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Action 1 */}
                    <button className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Start Simulation</h4>
                            <p className="text-xs text-text-secondary mt-1">Open the market</p>
                        </div>
                    </button>

                    {/* Action 2 */}
                    <button className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-500/20 text-orange-500 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Continue Learning</h4>
                            <p className="text-xs text-text-secondary mt-1">Module 3: Candlesticks</p>
                        </div>
                    </button>

                    {/* Action 3 */}
                    <button className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-500 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Ask AI Mentor</h4>
                            <p className="text-xs text-text-secondary mt-1">Get instant analysis</p>
                        </div>
                    </button>

                    {/* Action 4 */}
                    <button className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">forum</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Community</h4>
                            <p className="text-xs text-text-secondary mt-1">Check new discussions</p>
                        </div>
                    </button>
                </div>
            </section>

            {/* Middle Section: Chart & Learning */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Portfolio Chart (Takes up 2/3) */}
                <div className="lg:col-span-2 rounded-xl border border-card-border bg-card-dark p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Portfolio Growth</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-bold text-white">Rp 10,245,000</span>
                                <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-xs font-bold text-green-500 flex items-center gap-0.5">
                                    <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 2.45%
                                </span>
                            </div>
                        </div>
                        <div className="flex rounded-lg bg-background-dark p-1">
                            <button className="rounded px-3 py-1 text-xs font-medium text-text-secondary hover:text-white">1D</button>
                            <button className="rounded bg-card-border px-3 py-1 text-xs font-medium text-white shadow-sm">1W</button>
                            <button className="rounded px-3 py-1 text-xs font-medium text-text-secondary hover:text-white">1M</button>
                            <button className="rounded px-3 py-1 text-xs font-medium text-text-secondary hover:text-white">1Y</button>
                        </div>
                    </div>

                    {/* SVG Chart */}
                    <div className="relative h-[240px] w-full">
                        <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 240">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#2b9c91" stopOpacity="0.3"></stop>
                                    <stop offset="100%" stopColor="#2b9c91" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line stroke="#2b3635" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
                            <line stroke="#2b3635" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                            <line stroke="#2b3635" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
                            <line stroke="#2b3635" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                            {/* Area Fill */}
                            <path d="M0,180 C100,170 150,190 200,150 C250,110 300,130 400,100 C500,70 550,90 600,60 C650,30 700,50 800,20 V240 H0 Z" fill="url(#chartGradient)"></path>
                            {/* Line */}
                            <path d="M0,180 C100,170 150,190 200,150 C250,110 300,130 400,100 C500,70 550,90 600,60 C650,30 700,50 800,20" fill="none" stroke="#2b9c91" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                            {/* Interactive Points (Decorational) */}
                            <circle cx="200" cy="150" fill="#2b9c91" r="4" stroke="#131f1e" strokeWidth="2"></circle>
                            <circle cx="400" cy="100" fill="#2b9c91" r="4" stroke="#131f1e" strokeWidth="2"></circle>
                            <circle cx="600" cy="60" fill="#2b9c91" r="4" stroke="#131f1e" strokeWidth="2"></circle>
                            <circle cx="800" cy="20" fill="#fff" r="6" stroke="#2b9c91" strokeWidth="3"></circle>
                        </svg>
                    </div>
                    {/* X Axis Labels */}
                    <div className="mt-4 flex justify-between px-2 text-xs font-medium text-text-secondary">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </div>

                {/* Learning Progress Widget (Takes up 1/3) */}
                <div className="flex flex-col gap-4">
                    <div className="flex-1 rounded-xl border border-card-border bg-card-dark p-6 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white">Current Course</h3>
                            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Module 3</span>
                        </div>
                        <h4 className="text-base font-semibold text-white mb-4">Mastering Candlestick Patterns</h4>
                        <div className="relative flex items-center justify-center py-4 flex-1">
                            {/* Circular Progress SVG */}
                            <svg className="h-32 w-32 rotate-[-90deg]" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" fill="none" r="45" stroke="#2b3635" strokeWidth="8"></circle>
                                <circle cx="50" cy="50" fill="none" r="45" stroke="#2b9c91" strokeDasharray="283" strokeDashoffset="99" strokeLinecap="round" strokeWidth="8"></circle>
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-bold text-white">65%</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Next: Doji Pattern Quiz</span>
                                <span className="text-white font-medium">15 min</span>
                            </div>
                            <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                                Continue Lesson
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Recent Activities */}
            <section className="rounded-xl border border-card-border bg-card-dark">
                <div className="border-b border-card-border px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Recent Activities</h3>
                    <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">View All</a>
                </div>
                <div className="divide-y divide-card-border">
                    {/* Item 1 */}
                    <div className="flex items-center gap-4 p-4 hover:bg-card-border/30 transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                        </div>
                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium text-white">Bought 5 lots of BBRI</p>
                                <p className="text-xs text-text-secondary">Simulation • Market Order</p>
                            </div>
                            <div className="mt-1 flex items-center gap-2 sm:mt-0">
                                <span className="text-xs font-bold text-text-secondary">2 hours ago</span>
                                <span className="text-sm font-bold text-white">-Rp 2,450,000</span>
                            </div>
                        </div>
                    </div>
                    {/* Item 2 */}
                    <div className="flex items-center gap-4 p-4 hover:bg-card-border/30 transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                            <span className="material-symbols-outlined text-[20px]">quiz</span>
                        </div>
                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium text-white">Completed Quiz #2: Moving Averages</p>
                                <p className="text-xs text-text-secondary">Education • Score: 90/100</p>
                            </div>
                            <div className="mt-1 flex items-center gap-2 sm:mt-0">
                                <span className="text-xs font-bold text-text-secondary">Yesterday</span>
                                <span className="text-sm font-bold text-green-500">+50 XP</span>
                            </div>
                        </div>
                    </div>
                    {/* Item 3 */}
                    <div className="flex items-center gap-4 p-4 hover:bg-card-border/30 transition-colors">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-500">
                            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                        </div>
                        <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-medium text-white">AI Mentor Analysis</p>
                                <p className="text-xs text-text-secondary">Portfolio Review requested</p>
                            </div>
                            <div className="mt-1 flex items-center gap-2 sm:mt-0">
                                <span className="text-xs font-bold text-text-secondary">2 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
