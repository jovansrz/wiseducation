import React, { useState, useEffect } from 'react';
import { TetrisGame } from '../components/games/TetrisGame';
import { WiseJumpGame } from '../components/games/WiseJumpGame';
import { usePortfolio } from '../context/PortfolioContext';
import { authClient } from '../lib/auth-client';

type GameMode = 'select' | 'tetris' | 'wise_jump';

interface LeaderboardEntry {
    rank: number;
    userId: string;
    highScore: number;
    gamesPlayed: number;
}

const API_BASE = 'http://localhost:3005/api';

export const Game: React.FC = () => {
    const [gameMode, setGameMode] = useState<GameMode>('select');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [activeLeaderboard, setActiveLeaderboard] = useState<'tetris' | 'wise_jump'>('tetris');
    const [isLoading, setIsLoading] = useState(false);
    const { virtualCash } = usePortfolio();
    const { data: session } = authClient.useSession();

    useEffect(() => {
        fetchLeaderboard(activeLeaderboard);
    }, [activeLeaderboard]);

    const fetchLeaderboard = async (gameType: 'tetris' | 'wise_jump') => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/game/leaderboard/${gameType}?limit=10`);
            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGameEnd = () => {
        setGameMode('select');
        fetchLeaderboard(activeLeaderboard);
    };

    // Format currency for display
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(Math.round(value));
    };

    if (gameMode === 'tetris') {
        return (
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 bg-card-dark border-b border-card-border">
                    <button
                        onClick={() => setGameMode('select')}
                        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Back to Games</span>
                    </button>
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                        <span>{virtualCash?.toLocaleString() || '10,000,000'} WISE Cash</span>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <TetrisGame
                        userId={session?.user?.id || ''}
                        onGameEnd={handleGameEnd}
                    />
                </div>
            </div>
        );
    }

    if (gameMode === 'wise_jump') {
        return (
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 bg-card-dark border-b border-card-border">
                    <button
                        onClick={() => setGameMode('select')}
                        className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Back to Games</span>
                    </button>
                    <div className="flex items-center gap-2 text-primary font-bold">
                        <span className="material-symbols-outlined">account_balance_wallet</span>
                        <span>{virtualCash?.toLocaleString() || '10,000,000'} WISE Cash</span>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                    <WiseJumpGame
                        userId={session?.user?.id || ''}
                        onGameEnd={handleGameEnd}
                    />
                </div>
            </div>
        );
    }

    // Game Selection Mode - Matching Simulation (Market) page style
    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
            {/* Market-style Header */}
            <header className="h-16 flex items-center justify-between px-6 border-b border-card-border bg-background-light dark:bg-background-dark shrink-0 gap-6">
                <div className="flex flex-1 items-center gap-8">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white hidden md:block whitespace-nowrap">Let's Play!</h2>
                    <div className="relative w-full max-w-lg hidden md:block">
                        <span className="absolute left-3 top-2.5 text-text-secondary material-symbols-outlined text-[20px]">search</span>
                        <input
                            className="w-full bg-background-light dark:bg-card-dark border border-card-border rounded-lg py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all placeholder-text-secondary"
                            placeholder="Search games..."
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    {/* Rewards Summary */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-text-secondary uppercase">Games Played</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">12</span>
                        </div>
                        <div className="w-px h-8 bg-card-border"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-text-secondary uppercase">Total Earned</span>
                            <span className="text-sm font-bold text-primary">+50,000 WISE</span>
                        </div>
                    </div>
                    <div className="flex h-9 items-center rounded-lg bg-background-light dark:bg-card-dark border border-card-border px-3 shadow-sm">
                        <span className="text-xs text-text-secondary mr-2">WISE CASH:</span>
                        <span className="text-sm font-bold text-primary">Rp {formatCurrency(virtualCash)}</span>
                    </div>
                    <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-card-border text-text-secondary transition-colors relative">
                        <span className="material-symbols-outlined text-[20px]">emoji_events</span>
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
                    {/* Live Status Indicator */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-xs text-text-secondary">Game Zone Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-[16px]">stars</span>
                            <span className="text-xs text-text-secondary">
                                Earn rewards by playing games!
                            </span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-card-border">
                        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
                            <a className="border-primary text-primary whitespace-nowrap py-4 px-1 border-b-2 font-bold text-sm flex items-center gap-2" href="#">
                                <span className="material-symbols-outlined text-[18px]">sports_esports</span>
                                All Games
                            </a>
                        </nav>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">videogame_asset</span>
                                Available Games
                            </h3>
                            <div className="flex bg-background-light dark:bg-card-dark rounded-lg p-1 border border-card-border">
                                <button className="px-3 py-1 rounded text-xs font-bold transition-colors bg-white dark:bg-card-border text-slate-900 dark:text-white shadow-sm">All</button>
                                <button className="px-3 py-1 rounded text-xs font-bold transition-colors text-text-secondary hover:text-slate-900 dark:hover:text-white">Popular</button>
                                <button className="px-3 py-1 rounded text-xs font-bold transition-colors text-text-secondary hover:text-slate-900 dark:hover:text-white">New</button>
                            </div>
                        </div>

                        {/* Game Cards Grid - Matching Market stock cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {/* Tetris Card */}
                            <div
                                onClick={() => setGameMode('tetris')}
                                className="bg-white dark:bg-card-dark rounded-xl border border-card-border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                            >
                                {/* Popular indicator */}
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                                    <span className="text-[9px] text-primary font-medium">POPULAR</span>
                                </div>

                                <div className="flex items-center gap-4 mb-4 mt-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-primary/10 border border-primary/20">
                                        <span className="material-symbols-outlined text-primary text-2xl">grid_view</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">Tetris</h4>
                                        <span className="text-xs text-text-secondary">Classic Block Puzzle</span>
                                    </div>
                                </div>

                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                    Master the blocks, clear lines, and earn massive WISE Cash rewards!
                                </p>

                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <div className="text-xl font-bold text-primary tracking-tight">500</div>
                                        <span className="text-xs text-text-secondary">WISE / Line</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-primary flex items-center justify-end">
                                            <span className="material-symbols-outlined text-[16px]">arrow_drop_up</span>
                                            High Reward
                                        </div>
                                        <span className="text-xs text-text-secondary">~5 min / game</span>
                                    </div>
                                </div>

                                {/* Progress indicator */}
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full w-[70%]"></div>
                                </div>
                            </div>

                            {/* Wise Jump Card */}
                            <div
                                onClick={() => setGameMode('wise_jump')}
                                className="bg-white dark:bg-card-dark rounded-xl border border-card-border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                            >
                                {/* New indicator */}
                                <div className="absolute top-3 right-3 flex items-center gap-1">
                                    <span className="text-[9px] text-orange-500 font-medium bg-orange-500/10 px-1.5 py-0.5 rounded">NEW</span>
                                </div>

                                <div className="flex items-center gap-4 mb-4 mt-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-primary/10 border border-primary/20">
                                        <img src="/mascot-flying.png" alt="WISE Owl" className="w-10 h-10 object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white leading-tight">Wise Jump</h4>
                                        <span className="text-xs text-text-secondary">Endless Runner</span>
                                    </div>
                                </div>

                                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                    Run, jump, and collect coins. Help WISE owl reach new heights!
                                </p>

                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <div className="text-xl font-bold text-primary tracking-tight">1,000</div>
                                        <span className="text-xs text-text-secondary">WISE / Coin</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-primary flex items-center justify-end">
                                            <span className="material-symbols-outlined text-[16px]">arrow_drop_up</span>
                                            Top Reward
                                        </div>
                                        <span className="text-xs text-text-secondary">~3 min / game</span>
                                    </div>
                                </div>

                                {/* Progress indicator */}
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full w-[40%]"></div>
                                </div>
                            </div>

                            {/* Coming Soon Card 1 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border p-5 shadow-sm opacity-60 cursor-not-allowed relative overflow-hidden">
                                <div className="absolute top-3 right-3">
                                    <span className="text-[9px] text-text-secondary font-medium bg-card-border px-1.5 py-0.5 rounded">COMING SOON</span>
                                </div>

                                <div className="flex items-center gap-4 mb-4 mt-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-card-border border border-card-border">
                                        <span className="material-symbols-outlined text-text-secondary text-2xl">casino</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-secondary leading-tight">Stock Quiz</h4>
                                        <span className="text-xs text-text-secondary/70">Knowledge Challenge</span>
                                    </div>
                                </div>

                                <p className="text-sm text-text-secondary/70 mb-4 line-clamp-2">
                                    Test your investment knowledge and earn rewards!
                                </p>

                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <div className="text-xl font-bold text-text-secondary tracking-tight">???</div>
                                        <span className="text-xs text-text-secondary/70">WISE / Question</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-text-secondary/70">Coming Q2 2026</span>
                                    </div>
                                </div>

                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-text-secondary/30 rounded-full w-[0%]"></div>
                                </div>
                            </div>

                            {/* Coming Soon Card 2 */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border p-5 shadow-sm opacity-60 cursor-not-allowed relative overflow-hidden">
                                <div className="absolute top-3 right-3">
                                    <span className="text-[9px] text-text-secondary font-medium bg-card-border px-1.5 py-0.5 rounded">COMING SOON</span>
                                </div>

                                <div className="flex items-center gap-4 mb-4 mt-3">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden bg-card-border border border-card-border">
                                        <span className="material-symbols-outlined text-text-secondary text-2xl">rocket_launch</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text-secondary leading-tight">Crypto Catch</h4>
                                        <span className="text-xs text-text-secondary/70">Arcade Game</span>
                                    </div>
                                </div>

                                <p className="text-sm text-text-secondary/70 mb-4 line-clamp-2">
                                    Catch falling crypto coins while avoiding the scams!
                                </p>

                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <div className="text-xl font-bold text-text-secondary tracking-tight">???</div>
                                        <span className="text-xs text-text-secondary/70">WISE / Catch</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-text-secondary/70">Coming Q3 2026</span>
                                    </div>
                                </div>

                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-text-secondary/30 rounded-full w-[0%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Grid: Leaderboard & Your Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Leaderboard */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-card-border flex items-center justify-between bg-primary/5">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">emoji_events</span>
                                        <h3 className="font-bold text-slate-900 dark:text-white">Leaderboard</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setActiveLeaderboard('tetris')}
                                            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${activeLeaderboard === 'tetris' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}
                                        >
                                            Tetris
                                        </button>
                                        <button
                                            onClick={() => setActiveLeaderboard('wise_jump')}
                                            className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${activeLeaderboard === 'wise_jump' ? 'bg-primary text-white' : 'text-text-secondary hover:text-white'}`}
                                        >
                                            Wise Jump
                                        </button>
                                    </div>
                                </div>
                                {isLoading ? (
                                    <div className="p-8 text-center text-text-secondary">Loading...</div>
                                ) : leaderboard.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">leaderboard</span>
                                        <p className="text-text-secondary text-sm">No players yet. Be the first!</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm text-left">
                                        <tbody className="divide-y divide-card-border">
                                            {leaderboard.slice(0, 5).map((entry, index) => (
                                                <tr key={entry.userId} className="hover:bg-background-light dark:hover:bg-card-border/30 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${index === 0 ? 'bg-yellow-500 text-black' :
                                                            index === 1 ? 'bg-gray-300 text-black' :
                                                                index === 2 ? 'bg-orange-400 text-black' :
                                                                    'bg-card-border text-text-secondary'
                                                            }`}>
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                                        {entry.userId === session?.user?.id ? 'You' : `Player ${entry.userId.slice(0, 4)}...`}
                                                    </td>
                                                    <td className="px-4 py-3 text-text-secondary text-xs">{entry.gamesPlayed} games</td>
                                                    <td className="px-4 py-3 text-right font-bold text-primary">{entry.highScore.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Your Gaming Stats */}
                            <div className="bg-white dark:bg-card-dark rounded-xl border border-card-border p-6 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-900 dark:text-white">Your Gaming Stats</h3>
                                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded">PLAYER</span>
                                </div>
                                <div className="relative h-4 bg-background-light dark:bg-card-border rounded-full overflow-hidden mb-2">
                                    <div className="absolute left-0 top-0 h-full bg-primary w-[45%]"></div>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-text-secondary mb-6">
                                    <span>Level Progress</span>
                                    <span>45% to Level 3</span>
                                </div>
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Recent Achievements</h4>
                                <ul className="space-y-3">
                                    <li className="flex gap-3 text-sm">
                                        <span className="material-symbols-outlined text-yellow-500 text-[20px] shrink-0">military_tech</span>
                                        <span className="text-text-secondary">Reached <strong className="text-slate-900 dark:text-white">1,000 points</strong> in Tetris!</span>
                                    </li>
                                    <li className="flex gap-3 text-sm">
                                        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">stars</span>
                                        <span className="text-text-secondary">Collected <strong className="text-slate-900 dark:text-white">50 coins</strong> in Wise Jump.</span>
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
