import React from 'react';
import { Link } from 'react-router-dom';

export const Game: React.FC = () => {
    return (
        <div className="w-full max-w-[1280px] grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Stats & Games */}
            <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Headline */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight">Game & Quiz Hub</h1>
                    <p className="text-text-secondary text-lg">Earn coins while mastering financial skills.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Streak Card */}
                    <div className="flex items-center gap-4 rounded-xl p-6 bg-card-dark border border-card-border shadow-sm">
                        <div className="size-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                            <span className="material-symbols-outlined text-3xl">local_fire_department</span>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-text-secondary text-sm font-medium">Daily Streak</p>
                            <p className="text-white text-2xl font-bold">12 Days</p>
                        </div>
                    </div>
                    {/* Coin Balance Card */}
                    <div className="flex items-center gap-4 rounded-xl p-6 bg-card-dark border border-card-border shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-primary/10 to-transparent"></div>
                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">monetization_on</span>
                        </div>
                        <div className="flex flex-col z-10">
                            <p className="text-text-secondary text-sm font-medium">Coin Balance</p>
                            <p className="text-primary text-2xl font-bold">Rp 15,400</p>
                        </div>
                    </div>
                </div>

                {/* Challenge Section */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-white text-xl font-bold">Today's Challenges</h2>
                        <a className="text-primary text-sm font-medium hover:underline" href="#">View All</a>
                    </div>
                    {/* Game Card 1 - Investment Tetris */}
                    <Link to="/game/tetris" className="group relative flex flex-col md:flex-row overflow-hidden rounded-xl bg-card-dark border border-card-border shadow-lg transition-all hover:border-primary/50 hover:shadow-primary/5 cursor-pointer">
                        <div
                            className="w-full md:w-64 h-48 md:h-auto bg-cover bg-center shrink-0"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBLhzxL8RkV2jmFyBRo-0UnycshuUEFLs6CcxG0DHgFO3WaHrWPNVTHH9Jy3PDF1lGYyzcmLqRAoyC3jyS3wBE-Si9FkrPsiGJXsSPAvpV-MisZZ_0XF3EzvDjHFSmY1w2JzNUYk-C0p7xiI2MleJXwnEq2nFLul84lS_M30Z9_aDZleBrjES77IB4P7VflW2RMOPzyg-_G21kvtzHqOgEie3h3ZcY9okLa4VsTzM9DaJ2xZG4CTFmZwRG2E7yisoTU5hfk_cJFhyg')" }}
                        >
                            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">play_arrow</span> Play Now
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Investment Tetris</h3>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <span className="material-symbols-outlined text-sm fill-1">star</span>
                                        <span className="text-sm font-medium text-white">4.8</span>
                                    </div>
                                </div>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-2">Clear lines to earn virtual cash! Get bonus rewards with combos. Tetris = Rp 600!</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2 py-1 bg-primary/20 border border-primary/30 rounded text-xs text-primary font-medium">Rewards</span>
                                    <span className="px-2 py-1 bg-card-border rounded text-xs text-gray-300 font-medium">Strategy</span>
                                    <span className="px-2 py-1 bg-card-border rounded text-xs text-gray-300 font-medium">Classic</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-card-border">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-1 text-yellow-400">
                                        <span className="material-symbols-outlined text-lg">toll</span>
                                        <span className="font-bold">Rp 50-600</span>
                                    </div>
                                    <span className="text-gray-500">per clear</span>
                                </div>
                                <div className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-[0_0_10px_rgba(43,161,149,0.3)] group-hover:shadow-[0_0_15px_rgba(43,161,149,0.5)]">
                                    Play Now
                                </div>
                            </div>
                        </div>
                    </Link>
                    {/* Game Card 2 */}
                    <div className="group relative flex flex-col md:flex-row overflow-hidden rounded-xl bg-card-dark border border-card-border shadow-lg transition-all hover:border-primary/50 hover:shadow-primary/5">
                        <div
                            className="w-full md:w-64 h-48 md:h-auto bg-cover bg-center shrink-0"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsp8HTGEig3NIP2dffKCsay5o40gD5Bs9Nr1CHpmb72q5l8G_dGMvnmqx3gxpzJb69kKeVJvYg38kUPldPMxRdQcQwxLATxK50cv2J8RYBRdvWk61Ri9V7_O51BYCwLzzIjV8uHiodcckf9_nuCJEKiXN7hbOL7ol5Ehp6N9Sb6EZ_lzcWJEeKcWVO9PQdEaWiqPbWvg5RlYy9tSD7Bvx15fyW9W2k5pzcNr0Os_8FVGe0u9Pp1ISd7yDCrlPsuPi-mHMkqCqCs3U')" }}
                        >
                            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white">
                                Daily
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Daily Market Quiz</h3>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <span className="material-symbols-outlined text-sm fill-1">star</span>
                                        <span className="text-sm font-medium text-white">4.5</span>
                                    </div>
                                </div>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-2">Test your knowledge on today's market trends and financial news. Can you score 10/10?</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2 py-1 bg-card-border rounded text-xs text-gray-300 font-medium">Easy</span>
                                    <span className="px-2 py-1 bg-card-border rounded text-xs text-gray-300 font-medium">Trivia</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-card-border">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined text-lg">toll</span>
                                    <span className="font-bold text-sm">+200 Coins</span>
                                </div>
                                <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-[0_0_10px_rgba(43,161,149,0.3)] hover:shadow-[0_0_15px_rgba(43,161,149,0.5)]">
                                    Start Quiz
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Game Card 3 */}
                    <div className="group relative flex flex-col md:flex-row overflow-hidden rounded-xl bg-card-dark border border-card-border shadow-lg transition-all hover:border-primary/50 hover:shadow-primary/5 opacity-80 hover:opacity-100">
                        <div
                            className="w-full md:w-64 h-48 md:h-auto bg-cover bg-center shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCg_RBUU28VFumZPt89KsrVKSlBN00VrgIhh-JnfAra6NW65xwc-BDSXbtatbZC70J3KdX--jDJspTYvp_obeE-x9eXYjt8hXICk0w_vI09GEs2Lu4gF7aSQO1OQDLhtYK97X8ebjhIWqR27yQxcfZWu3_QnEAtWHtxfh_gZnFAzKFjwv75CNBgKHtEc-XqmMWfioTfUUJvlFhQKv31zI-t5uJJL5RJ77S27Xz0QU3cKmRx4OGx5gDZQCaFm2sVRrFZ_CoMB0ZxG-8')" }}
                        >
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">Savings Tycoon</h3>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <span className="material-symbols-outlined text-sm">star</span>
                                        <span className="text-sm font-medium text-gray-400">--</span>
                                    </div>
                                </div>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-2">Build your savings empire from scratch. Unlock this game by reaching Streak Level 15.</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="px-2 py-1 bg-card-border rounded text-xs text-gray-300 font-medium">Hard</span>
                                    <span className="px-2 py-1 bg-card-border rounded text-xs text-gray-300 font-medium">Simulation</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-4 border-t border-card-border">
                                <div className="flex items-center gap-2 text-gray-500">
                                    <span className="material-symbols-outlined text-lg">lock</span>
                                    <span className="font-bold text-sm">Locked</span>
                                </div>
                                <button className="bg-gray-700 text-gray-400 cursor-not-allowed text-sm font-bold py-2 px-6 rounded-lg">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Leaderboard */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Leaderboard Widget */}
                <div className="bg-card-dark border border-card-border rounded-xl p-6 flex flex-col gap-6 sticky top-24">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-yellow-500">trophy</span>
                            <h3 className="text-white text-lg font-bold">Weekly Leaders</h3>
                        </div>
                        <span className="text-xs text-gray-500 font-medium bg-background-dark px-2 py-1 rounded border border-card-border">Reset in 2d</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* Top 1 */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-card-border to-transparent border border-yellow-500/30 relative">
                            <div className="absolute -left-1 -top-1 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded-full z-10">1</div>
                            <div className="size-10 rounded-full bg-cover bg-center border-2 border-yellow-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUp-YBy0-R_EF49qELr6dCN37CbTp4MK-wLl4-pJ1r_oHNel84-jOEjAYA_cBotjOCImyaGkjl02RXUwnwLVn3HyGiONNSy5PSNKFQbc6z_X7J_b5EtxIgJDqVzSzId_1jSoYp7C7TChWWf0BKnrVcBkFkLtx31TWFErMtdhysoQVwcCNt5kQYLOxmpvxcQPLJebIVfGS1c-daxAkJ7PP-9stUW4bdoo3JRDL8idQJMN7FTM9cj7w6SbnNc14mLg7HiNcUXVvUL-E')" }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">Sarah J.</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1 rounded">Pro Investor</span>
                                </div>
                            </div>
                            <p className="text-primary font-bold text-sm whitespace-nowrap">Rp 52.4k</p>
                        </div>
                        {/* Top 2 */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background-dark border border-card-border">
                            <div className="text-gray-400 text-sm font-bold w-4 text-center">2</div>
                            <div className="size-10 rounded-full bg-cover bg-center border border-gray-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwhJDlseHuNIkjGPdPYABss04hGck4DPeqqB_EwkiJybZz5EEWuZj8CUvvezCp0xF007EGb6GMIpRwSR54a7DfCcM-60-H1okuD98GGOPxB6rKsCSjewDdkcqGOexU2C0NJGL75vBr8-PJD4MYpanQs9z6BdPPUypnLnBWXHQtLijq38M9VlgNb9e5QAjeczfsjshDXPzls-1hCyTpwjr2arRwVp3OCvEr9F-y53wWJN8CSOb2wQZlzJdkOJr5zHBDiQ8WpcndDHU')" }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">Mike T.</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-blue-400 bg-blue-400/10 px-1 rounded">Analyst</span>
                                </div>
                            </div>
                            <p className="text-primary font-bold text-sm whitespace-nowrap">Rp 48.1k</p>
                        </div>
                        {/* Top 3 */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background-dark border border-card-border">
                            <div className="text-gray-400 text-sm font-bold w-4 text-center">3</div>
                            <div className="size-10 rounded-full bg-cover bg-center border border-gray-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCx-p8FU_nD-_qqE7f1LH8Z31HJjhTqn0l7wW1WsV8QuYwortsEJvM_2eES1W2rcNpxzuXCA6stLHN_POABmxC77wa1kIwgUpXdilL4s6zl9eqkDmeUUPllReZhR6rcJUumrAo1bHTZRq0IejQMJMsyaj4wlyMDWLs8Pc0k-9Tg4kDKmj7F23aqpGwWPrrke08HNvqZCd29_mE4Eh_bFK60qFM5N6eBaFkI4nPyXIuPHXuXXue5gb7h1CdDv1UhAB0CTnMwt3YyqCs')" }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">Alex R.</p>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] text-green-400 bg-green-400/10 px-1 rounded">Rookie</span>
                                </div>
                            </div>
                            <p className="text-primary font-bold text-sm whitespace-nowrap">Rp 41.5k</p>
                        </div>
                        {/* Top 4 */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background-dark border border-card-border">
                            <div className="text-gray-400 text-sm font-bold w-4 text-center">4</div>
                            <div className="size-10 rounded-full bg-cover bg-center border border-gray-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCJpjRnYmXuOTIx0J45pUpN553Hc3UGyt8D-0e0pe7JkKeFIqftJjYhjtnuP-hodlRJmNKNld40AgshabnNkZxuZVicJ2HXo_DR0_vUObhqcKgOaxyJ-MEUZHLwTO5CEvQB7GrUwsocPNZjXDsf5LsqPzk_7S8MmbajWnrNQvs-CtpIcYDjkcRRg_2saNNCcNbGmp-dw7SZfUER_OKpJO3PqBxJvDxze0kmwj74EF36r_vtQi5tW0UA0A3rmtxKVnRooJUlFyYAZ9Q')" }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">Daniel K.</p>
                            </div>
                            <p className="text-primary font-bold text-sm whitespace-nowrap">Rp 38.2k</p>
                        </div>
                        {/* Top 5 */}
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-background-dark border border-card-border">
                            <div className="text-gray-400 text-sm font-bold w-4 text-center">5</div>
                            <div className="size-10 rounded-full bg-cover bg-center border border-gray-600" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC2pSDF9N2xGW47NKt0h_RB6s5mtpxfZmTKzzOwAlYUxdaBXB-MsyFTa8urUtmDy5fpbOSfMyc-CVadKLW20In4G7mGS4o317my-91ecQNS6omwDHaQ_WbhDUOTqvXIZHwEUnXGze418iJxBkHnvaek3k8KR7gTE7iAGCGLGVk56zwl7T4ol4_y4iCFNzgx47faSNQGkGF3FgkHgfoesFWmgPV_iMj_rfltkDsYNe3G82R9RvWOJ391kb88sEEUW-LIwVFaUoca824')" }}></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold truncate">Jenny W.</p>
                            </div>
                            <p className="text-primary font-bold text-sm whitespace-nowrap">Rp 36.9k</p>
                        </div>
                        {/* User Rank (Your Rank) */}
                        <div className="mt-2 pt-4 border-t border-card-border">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/20 border border-primary/40">
                                <div className="text-primary text-sm font-bold w-4 text-center">18</div>
                                <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1SdCYq-MDdtUH1rYUvq_2C5ZXb2C_r7-_69_HqdnxKvuqshP12y8sGA5EclqyV_On69PuwuF_51is4JVvV3WMaDLQr-dXC6E-rDbX-96kuVP7T18oK2Wduq4O6xQZuMGoPLktiwm8vVYYyZ8nFQSSKOgzLZC2f6Up5qCWZq9QIVaJ5WrKxQUv51chGtgUDq18XE63P3uaGHpt6IHbqDgRsBeeiVbbnG4-yRootQ-5He4bkscJgVvJ2YkVAb0eY9mjvNebXqAy-Tk')" }}></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-bold truncate">You</p>
                                    <div className="text-xs text-text-secondary">Top 15%</div>
                                </div>
                                <p className="text-primary font-bold text-sm whitespace-nowrap">Rp 15.4k</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full py-2.5 text-sm font-medium text-gray-300 bg-card-border rounded-lg hover:bg-[#344241] transition-colors">
                        View Full Standings
                    </button>
                </div>
                {/* Ad / Promotion Card */}
                <div className="rounded-xl p-6 bg-gradient-to-br from-primary to-[#1d6f66] text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 text-white/10 rotate-12">
                        <span className="material-symbols-outlined text-[120px]">workspace_premium</span>
                    </div>
                    <div className="relative z-10">
                        <h4 className="font-bold text-lg mb-2">Unlock Premium Games</h4>
                        <p className="text-white/80 text-sm mb-4">Get access to advanced investment simulations and double XP weekends.</p>
                        <button className="bg-white text-primary text-xs font-bold py-2 px-4 rounded shadow-sm hover:bg-gray-100 transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
