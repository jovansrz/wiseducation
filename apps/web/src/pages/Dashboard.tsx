import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { TransactionHistoryModal } from '../components/TransactionHistoryModal';
import { NewsSection } from '../components/NewsSection';


const INITIAL_BALANCE = 10_000_000;

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { virtualCash, totalValue, totalProfit, holdings, transactions } = usePortfolio();
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    // Dynamic Greeting Logic
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 15) return "Good Afternoon";
        if (hour >= 15 && hour < 18) return "Good Evening";
        return "Good Night";
    };

    // Format currency for display
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(Math.round(value));
    };

    // Calculate profit percentage
    const profitPercent = totalValue > 0 ? (totalProfit / (totalValue - totalProfit)) * 100 : 0;

    // Get transactions based on view mode (always top 3 for dashboard list)
    const displayedTransactions = transactions.slice(0, 3);

    // Generate dynamic chart path based on transaction history
    const chartData = useMemo(() => {
        if (transactions.length === 0) {
            // No transactions - flat line at initial balance
            return { path: 'M0,120 L800,120', fillPath: 'M0,120 L800,120 V240 H0 Z', isProfit: true };
        }

        // Build portfolio value history from transactions
        const valueHistory: { time: number; value: number }[] = [];
        let runningCash = INITIAL_BALANCE;
        const holdingsMap: Record<string, { quantity: number; price: number }> = {};

        // Start with initial balance
        valueHistory.push({ time: Date.now() - 7 * 24 * 60 * 60 * 1000, value: INITIAL_BALANCE });

        // Reverse to process oldest first
        const sortedTx = [...transactions].reverse();

        sortedTx.forEach(tx => {
            if (tx.type === 'BUY') {
                runningCash -= tx.total;
                if (!holdingsMap[tx.ticker]) {
                    holdingsMap[tx.ticker] = { quantity: 0, price: tx.price };
                }
                holdingsMap[tx.ticker].quantity += tx.quantity;
                holdingsMap[tx.ticker].price = tx.price;
            } else {
                runningCash += tx.total;
                if (holdingsMap[tx.ticker]) {
                    holdingsMap[tx.ticker].quantity -= tx.quantity;
                    if (holdingsMap[tx.ticker].quantity <= 0) {
                        delete holdingsMap[tx.ticker];
                    }
                }
            }

            // Calculate total value at this point
            const holdingsValue = Object.values(holdingsMap).reduce(
                (sum, h) => sum + h.quantity * 100 * h.price, 0
            );
            valueHistory.push({
                time: new Date(tx.timestamp).getTime(),
                value: runningCash + holdingsValue
            });
        });

        // Add current value
        valueHistory.push({ time: Date.now(), value: totalValue });

        // Convert to SVG path
        if (valueHistory.length < 2) {
            return { path: 'M0,120 L800,120', fillPath: 'M0,120 L800,120 V240 H0 Z', isProfit: true };
        }

        const minValue = Math.min(...valueHistory.map(v => v.value)) * 0.95;
        const maxValue = Math.max(...valueHistory.map(v => v.value)) * 1.05;
        const range = maxValue - minValue || 1;

        const points = valueHistory.map((v, i) => {
            const x = (i / (valueHistory.length - 1)) * 800;
            const y = 220 - ((v.value - minValue) / range) * 200;
            return `${x},${y}`;
        });

        const path = `M${points.join(' L')}`;
        const fillPath = `${path} V240 H0 Z`;
        const isProfit = totalValue >= INITIAL_BALANCE;

        return { path, fillPath, isProfit };
    }, [transactions, totalValue]);

    return (
        <>
            {/* Welcome Section */}
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">{getGreeting()}, Wiserz! 👋</h2>
                <p className="text-text-secondary">
                    {totalProfit >= 0
                        ? <>Your portfolio is <span className="text-primary font-medium">up!</span> Keep up the great work.</>
                        : <>Your portfolio is <span className="text-red-500 font-medium">down.</span> Stay calm and invest wisely.</>
                    }
                </p>
            </div>

            {/* Top Grid: Quick Actions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Action 1 */}
                    <button onClick={() => navigate('/market')} className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/20 text-primary group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Start Investing</h4>
                            <p className="text-xs text-text-secondary mt-1">Open the market</p>
                        </div>
                    </button>

                    {/* Action 2 */}
                    <button onClick={() => navigate('/education')} className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-orange-500/20 text-orange-500 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Continue Learning</h4>
                            <p className="text-xs text-text-secondary mt-1">Module 3: Candlesticks</p>
                        </div>
                    </button>

                    {/* Action 3 */}
                    <button onClick={() => navigate('/ai-assistant')} className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
                        <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-purple-500/20 text-purple-500 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined">smart_toy</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Ask AI Mentor</h4>
                            <p className="text-xs text-text-secondary mt-1">Get instant analysis</p>
                        </div>
                    </button>

                    {/* Action 4 */}
                    <button onClick={() => navigate('/community')} className="group flex flex-col gap-3 rounded-xl border border-card-border bg-card-dark p-5 hover:border-primary/50 hover:bg-card-dark/80 transition-all text-left">
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

            {/* Market News Section */}
            <NewsSection />


            {/* Middle Section: Chart & Learning */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Portfolio Chart (Takes up 2/3) */}
                <div className="lg:col-span-2 rounded-xl border border-card-border bg-card-dark p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Investment Portfolio</h3>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-2xl font-bold text-white">Rp {formatCurrency(totalValue)}</span>
                                <span className={`rounded px-1.5 py-0.5 text-xs font-bold flex items-center gap-0.5 ${totalProfit >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                    <span className="material-symbols-outlined text-[12px]">{totalProfit >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>
                                    {Math.abs(profitPercent).toFixed(2)}%
                                </span>
                            </div>
                            <div className="flex gap-4 mt-2 text-xs">
                                <span className="text-text-secondary">Cash: <span className="text-white font-medium">Rp {formatCurrency(virtualCash)}</span></span>
                                <span className="text-text-secondary">Holdings: <span className="text-white font-medium">{holdings.length} stocks</span></span>
                            </div>
                        </div>
                        <div className="flex rounded-lg bg-background-dark p-1">
                            <button className="rounded px-3 py-1 text-xs font-medium text-text-secondary hover:text-white">1D</button>
                            <button className="rounded bg-card-border px-3 py-1 text-xs font-medium text-white shadow-sm">1W</button>
                            <button className="rounded px-3 py-1 text-xs font-medium text-text-secondary hover:text-white">1M</button>
                            <button className="rounded px-3 py-1 text-xs font-medium text-text-secondary hover:text-white">1Y</button>
                        </div>
                    </div>

                    {/* Dynamic SVG Chart */}
                    <div className="relative h-[240px] w-full">
                        <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 240">
                            <defs>
                                <linearGradient id="chartGradientProfit" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#2b9c91" stopOpacity="0.3"></stop>
                                    <stop offset="100%" stopColor="#2b9c91" stopOpacity="0"></stop>
                                </linearGradient>
                                <linearGradient id="chartGradientLoss" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"></stop>
                                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0"></stop>
                                </linearGradient>
                            </defs>
                            {/* Grid Lines */}
                            <line stroke="#2b3635" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="60" y2="60"></line>
                            <line stroke="#2b3635" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="120" y2="120"></line>
                            <line stroke="#2b3635" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="800" y1="180" y2="180"></line>
                            {/* Area Fill */}
                            <path d={chartData.fillPath} fill={`url(#chartGradient${chartData.isProfit ? 'Profit' : 'Loss'})`}></path>
                            {/* Line */}
                            <path d={chartData.path} fill="none" stroke={chartData.isProfit ? "#2b9c91" : "#ef4444"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
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

            {/* Bottom Section: Recent Investment Activities */}
            <section className="rounded-xl border border-card-border bg-card-dark">
                <div className="border-b border-card-border px-6 py-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Recent Investment Activity</h3>
                    <button onClick={() => navigate('/market')} className="text-sm font-medium text-primary hover:text-primary/80">Invest Now</button>
                </div>
                <div className="divide-y divide-card-border">
                    {displayedTransactions.length > 0 ? (
                        <>
                            {displayedTransactions.map(tx => (
                                <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-card-border/30 transition-colors">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tx.type === 'BUY' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                        <span className="material-symbols-outlined text-[20px]">{tx.type === 'BUY' ? 'add_circle' : 'remove_circle'}</span>
                                    </div>
                                    <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-medium text-white">{tx.type === 'BUY' ? 'Invested in' : 'Sold'} {tx.quantity} lots of {tx.ticker}</p>
                                            <p className="text-xs text-text-secondary">Simulation • @ Rp {formatCurrency(tx.price)}/share</p>
                                        </div>
                                        <div className="mt-1 flex items-center gap-2 sm:mt-0">
                                            <span className="text-xs font-bold text-text-secondary">{new Date(tx.timestamp).toLocaleDateString()}</span>
                                            <span className={`text-sm font-bold ${tx.type === 'BUY' ? 'text-white' : 'text-green-500'}`}>
                                                {tx.type === 'BUY' ? '-' : '+'}Rp {formatCurrency(tx.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* View All Button */}
                            {transactions.length > 0 && (
                                <div className="p-4 text-center">
                                    <button
                                        onClick={() => setIsHistoryModalOpen(true)}
                                        className="px-6 py-2 text-sm font-bold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
                                    >
                                        View All Transactions
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">history</span>
                            <p className="text-text-secondary">No investment activity yet</p>
                            <button onClick={() => navigate('/market')} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                                Start Investing
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* History Modal */}
            <TransactionHistoryModal
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                transactions={transactions}
            />
        </>
    );
};
