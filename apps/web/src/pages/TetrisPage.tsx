import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TetrisGame } from '../components/TetrisGame';
import { authClient } from '../lib/auth-client';

interface LeaderboardEntry {
    id: string;
    userId: string;
    score: number;
    linesCleared: number;
    cashEarned: number;
    maxCombo: number;
    playedAt: string;
}

interface UserGameStats {
    id: string;
    userId: string;
    virtualBalance: number;
    tetrisHighScore: number;
    totalGameEarnings: number;
    gamesPlayed: number;
    totalLinesCleared: number;
}

const API_URL = 'http://localhost:3005/api';

export const TetrisPage: React.FC = () => {
    const { data: session } = authClient.useSession();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userStats, setUserStats] = useState<UserGameStats | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lastResult, setLastResult] = useState<{ isNewHighScore: boolean; cashEarned: number } | null>(null);

    // Fetch leaderboard
    const fetchLeaderboard = async () => {
        try {
            const response = await fetch(`${API_URL}/game/leaderboard/tetris?limit=10`);
            if (response.ok) {
                const data = await response.json();
                setLeaderboard(data);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard:', error);
        }
    };

    // Fetch user stats
    const fetchUserStats = async () => {
        if (!session?.user?.id) return;

        try {
            const response = await fetch(`${API_URL}/game/stats`, {
                headers: { 'x-user-id': session.user.id }
            });
            if (response.ok) {
                const data = await response.json();
                setUserStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch user stats:', error);
        }
    };

    // Submit game score
    const handleGameOver = async (stats: {
        score: number;
        linesCleared: number;
        cashEarned: number;
        comboCount: number;
        maxCombo: number;
        duration: number;
    }) => {
        if (!session?.user?.id || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/game/score`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': session.user.id,
                },
                body: JSON.stringify({
                    ...stats,
                    gameType: 'tetris',
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setLastResult({
                    isNewHighScore: result.isNewHighScore,
                    cashEarned: stats.cashEarned,
                });

                // Refresh stats and leaderboard
                await Promise.all([fetchUserStats(), fetchLeaderboard()]);
            }
        } catch (error) {
            console.error('Failed to submit score:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        fetchLeaderboard();
        if (session?.user?.id) {
            fetchUserStats();
        }
    }, [session?.user?.id]);

    return (
        <div className="min-h-screen bg-background-dark">
            {/* Header */}
            <div className="border-b border-card-border bg-card-dark/50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/game"
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span className="hidden sm:inline">Back to Games</span>
                        </Link>
                        <div className="h-6 w-px bg-card-border" />
                        <h1 className="text-white text-xl font-bold flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">videogame_asset</span>
                            Investment Tetris
                        </h1>
                    </div>

                    {/* User balance */}
                    {userStats && (
                        <div className="flex items-center gap-4">
                            <div className="bg-card-dark border border-card-border rounded-lg px-4 py-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-yellow-500">account_balance_wallet</span>
                                <span className="text-white font-bold">
                                    Rp {userStats.virtualBalance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    {/* Game area */}
                    <div className="xl:col-span-8">
                        <TetrisGame onGameOver={handleGameOver} />

                        {/* New high score notification */}
                        {lastResult?.isNewHighScore && (
                            <div className="mt-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/50 rounded-xl p-4 flex items-center gap-4">
                                <span className="material-symbols-outlined text-4xl text-yellow-500">emoji_events</span>
                                <div>
                                    <p className="text-yellow-400 font-bold text-lg">NEW HIGH SCORE!</p>
                                    <p className="text-gray-300 text-sm">Congratulations! You've set a new personal best.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="xl:col-span-4 flex flex-col gap-6">
                        {/* User Stats */}
                        {userStats && (
                            <div className="bg-card-dark border border-card-border rounded-xl p-6">
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">person</span>
                                    Your Stats
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-background-dark rounded-lg p-3">
                                        <p className="text-gray-400 text-xs">High Score</p>
                                        <p className="text-white font-bold text-lg">{userStats.tetrisHighScore.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-background-dark rounded-lg p-3">
                                        <p className="text-gray-400 text-xs">Games Played</p>
                                        <p className="text-white font-bold text-lg">{userStats.gamesPlayed}</p>
                                    </div>
                                    <div className="bg-background-dark rounded-lg p-3">
                                        <p className="text-gray-400 text-xs">Total Lines</p>
                                        <p className="text-blue-400 font-bold text-lg">{userStats.totalLinesCleared}</p>
                                    </div>
                                    <div className="bg-background-dark rounded-lg p-3">
                                        <p className="text-gray-400 text-xs">Total Earnings</p>
                                        <p className="text-yellow-400 font-bold text-lg">Rp {userStats.totalGameEarnings.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Leaderboard */}
                        <div className="bg-card-dark border border-card-border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-yellow-500">leaderboard</span>
                                    Top 10 Leaderboard
                                </h3>
                                <button
                                    onClick={fetchLeaderboard}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">refresh</span>
                                </button>
                            </div>

                            <div className="space-y-2">
                                {leaderboard.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <span className="material-symbols-outlined text-4xl mb-2 block">sports_esports</span>
                                        <p>No scores yet!</p>
                                        <p className="text-sm">Be the first to set a record!</p>
                                    </div>
                                ) : (
                                    leaderboard.map((entry, index) => (
                                        <div
                                            key={entry.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg ${index === 0
                                                    ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border border-yellow-500/30'
                                                    : index === 1
                                                        ? 'bg-gradient-to-r from-gray-400/20 to-transparent border border-gray-400/30'
                                                        : index === 2
                                                            ? 'bg-gradient-to-r from-orange-600/20 to-transparent border border-orange-600/30'
                                                            : 'bg-background-dark border border-card-border'
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                                                        ? 'bg-yellow-500 text-black'
                                                        : index === 1
                                                            ? 'bg-gray-400 text-black'
                                                            : index === 2
                                                                ? 'bg-orange-600 text-white'
                                                                : 'bg-card-border text-gray-400'
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium truncate">
                                                    Player {entry.userId.slice(0, 8)}...
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span>{entry.linesCleared} lines</span>
                                                    <span>•</span>
                                                    <span>{entry.maxCombo}x combo</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-primary font-bold">{entry.score.toLocaleString()}</p>
                                                <p className="text-yellow-400 text-xs">+Rp {entry.cashEarned.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-xl p-6">
                            <h3 className="text-primary font-bold text-lg mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined">tips_and_updates</span>
                                Pro Tips
                            </h3>
                            <ul className="text-gray-300 text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    <span>Clear 4 lines at once (Tetris) for maximum rewards!</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    <span>Build up combos for +10% bonus per consecutive clear</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    <span>Use the ghost piece to plan your drop location</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check</span>
                                    <span>Space bar for instant hard drop to speed up gameplay</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TetrisPage;
