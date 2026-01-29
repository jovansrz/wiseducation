import React from 'react';

export const Education: React.FC = () => {
    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-white">Learning Modules</h2>
                    <p className="text-text-secondary text-base md:text-lg">Welcome back, Investor! Continue your financial journey.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center gap-2 h-10 px-4 bg-card-dark border border-card-border rounded-lg text-sm font-bold text-white hover:bg-card-border transition-colors">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        <span>History</span>
                    </button>
                </div>
            </div>

            {/* Toolbar & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-card-dark p-4 rounded-xl border border-card-border">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
                    <input
                        className="w-full bg-background-dark border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary placeholder-text-secondary text-white outline-none"
                        placeholder="Search modules..."
                        type="text"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                    <button className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-white text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined filled-icon text-[18px]">grid_view</span>
                        All Levels
                    </button>
                    <button className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-card-border hover:bg-[#364442] px-4 text-white text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">emoji_objects</span>
                        Beginner
                    </button>
                    <button className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-card-border hover:bg-[#364442] px-4 text-white text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">trending_up</span>
                        Intermediate
                    </button>
                    <button className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-card-border hover:bg-[#364442] px-4 text-white text-sm font-medium transition-colors">
                        <span className="material-symbols-outlined text-[18px]">school</span>
                        Advanced
                    </button>
                </div>
                <div className="flex items-center gap-2 pl-2 border-l border-card-border">
                    <button className="p-2 text-text-secondary hover:text-white transition-colors" title="Filter">
                        <span className="material-symbols-outlined">filter_list</span>
                    </button>
                    <button className="p-2 text-text-secondary hover:text-white transition-colors" title="Sort">
                        <span className="material-symbols-outlined">sort</span>
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 w-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZEiUYla3kOc8KCCJLOHjwRg_sRIBhXmG0BdpT_pJrRQTXVuNNM0Qu_TqWndGGu6IyWNaHSewWEN_F6NfKqN_uDhf_ieaplCEeQJHlUiqpXXOncaUWudTzAk-dFgcx1MsW4qS-AaJAf3i4oly-XN3l1rp6mKN4_e32EYarmuEs42Afh7jGc5EX5Oua4nD19ZrU09iH6o6wrtcC_nPwpxzOCNnt4k7-A84g2er4C9hfUVFBZ3hxCspztSOdk41CZXl6_p40vXaAU1U')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-80"></div>
                        <div className="absolute top-3 left-3 bg-card-border/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">emoji_objects</span>
                            Beginner
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Pasar Saham 101</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">Learn the fundamentals of stock market investing and how to read basic charts.</p>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium text-text-secondary">
                                    <span>Progress</span>
                                    <span className="text-primary">45%</span>
                                </div>
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: "45%" }}></div>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm">
                                <span>Continue Learning</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 w-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDRjPXQbFiYgn9RiwnfjUap_2XjPHFGwYGKbuB5nhqpek7-rIgF-QR920tC7VRUC4usGG_mV48VvIS6OS8FonXFyxczk2cZgR2RQgaA2uYD8xZHcOcxqi5RR0DH_ODE_gIhGzCv1zr-v74axrAyObH5iRMQXtvuJhyafwISaedLeWLm-t4XoPxg9RGZcEEbgTXkuKoW8GrlGasyXcghuEunOtS-sVjvhwx4jvs9qiMkI-196FJSsXZdQ5IwFUnAJFbNYpxcxnee7ns')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-80"></div>
                        <div className="absolute top-3 left-3 bg-card-border/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            Intermediate
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Risk Management</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">Master the art of protecting your capital with advanced stop-loss strategies.</p>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium text-text-secondary">
                                    <span>Progress</span>
                                    <span className="text-primary">10%</span>
                                </div>
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: "10%" }}></div>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm">
                                <span>Continue Learning</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 w-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuByiZlCTJy0OHUPLio_xrj62nHF_3dsFvDIWzsy9eVIgj2WCjN5qxmOQTdJIIeYK3vl-v_xIYPR4rulxyU7_DjYWeoRoVq91Yzqzd3Oj5Ma0Dygn_VCsvYczmQQ2dXoiEtFZPoc6fRqItAz6ZEvyKhAoAdI51UOwowgKsy_vFOhAwIjLIWvsLusShPJ8xu7Vqq_OIK36nQJA8BdFwfxd48rE--ySJPerxDDBmurEP9ivzYTlOGQ7Lga2bYmsjJLsRpUWCLntZTXc0g')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-80"></div>
                        <div className="absolute top-3 left-3 bg-card-border/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">school</span>
                            Advanced
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Forex Strategies</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">Deep dive into currency pairs, macroeconomic indicators, and global news impact.</p>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium text-text-secondary">
                                    <span>Not Started</span>
                                    <span className="text-gray-500">0%</span>
                                </div>
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: "0%" }}></div>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-card-border hover:bg-[#364442] text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm border border-transparent hover:border-primary/30">
                                <span>Start Module</span>
                                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 w-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDyUwizUAtlbOuNDsMB4pHNd34n4LPSyummbpjdzOHDwC3KCqhEwB70ga1vWOBGMbEddHKPeMhmNnNrX_2KgevCYJEXVDCsJ4S4SYTZEM5G7_n56nz2S6wTB_RBKI9gb-Vl1_uKhPBSv9cY_E-t63zQ_HTsD_IzYzxyjxxRWq9PPnkLSK3_LK8XI3IScKqp25L6MoHFTYDQ457fgy0qdxIQIOOE1OBPXW8sY462eBvmzCgxiGM72q5K1tEF2DFK4BK6Cbd43iWxJQ')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-80"></div>
                        <div className="absolute top-3 left-3 bg-card-border/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">emoji_objects</span>
                            Beginner
                        </div>
                        <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1 shadow-lg">
                            <span className="material-symbols-outlined block text-[16px]">check</span>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Diversification</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">Why putting all your eggs in one basket is dangerous, and how to spread risk.</p>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium text-text-secondary">
                                    <span>Completed</span>
                                    <span className="text-primary">100%</span>
                                </div>
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: "100%" }}></div>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-card-border hover:bg-[#364442] text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm border border-transparent hover:border-primary/30">
                                <span>Review Again</span>
                                <span className="material-symbols-outlined text-[18px]">replay</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 5 */}
                <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 w-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDCDhvW3wek0jJ7hmsfA9ds7iMq-otJEI-txH7XRdkMWoB73_Ft_-2EuP5P5RLYIqFmpJQo0mguyoCGfcLTEnCsu0pgmQlbAYSSwjMzsnE04lcla43MRSQ4c7QJPaXT4LHHTPBzbNyekOdUJJnXPTQ7KRMDSkt4FJ-FXzzka74ISpMvFMjKmcQ0wXosJxLmK7rSybnWhhscCnss6vCzX3dOkbCVtcd4iHPDMArNz1_3B4P_VAGyPUdlqg_gmU0rJNpdfhkmLifPwx0')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-80"></div>
                        <div className="absolute top-3 left-3 bg-card-border/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-yellow-500 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            Intermediate
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Technical Analysis</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">Understanding support, resistance, and key chart patterns for better entries.</p>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium text-text-secondary">
                                    <span>Progress</span>
                                    <span className="text-primary">75%</span>
                                </div>
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: "75%" }}></div>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm">
                                <span>Continue Learning</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 6 */}
                <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                    <div className="relative h-48 w-full overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdy7QByqB0DbxspmTNuAbpwqE0tK7Is9ZA0cqsJf_02HbDAkGYy25z2zOxbtDFFIMkQDrXg1SMr8HzqktIwHOy15rGkDaFg2HfbCK7ItDP8SQg04_d4G-oxAYD_HFPeK-6Ss6NjZtPxS0mzam-NQtzNH-pb8mQ1vKmuCV82InwfsrNV0y7ITQ4MbeGnTJ5ujEpEpqGSce_4hqQ1g89wqItQ0eSdeviCTBX6er5eRmcWrxRGnNNut6grQAW8GPbJ3UuWGeghTgiWGM')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-80"></div>
                        <div className="absolute top-3 left-3 bg-card-border/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold text-red-400 uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">school</span>
                            Advanced
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                        <div className="mb-4">
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">Crypto Futures</h3>
                            <p className="text-text-secondary text-sm line-clamp-2">Advanced leverage trading in the volatile cryptocurrency market environment.</p>
                        </div>
                        <div className="mt-auto space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex justify-between text-xs font-medium text-text-secondary">
                                    <span>Progress</span>
                                    <span className="text-primary">5%</span>
                                </div>
                                <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full" style={{ width: "5%" }}></div>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm">
                                <span>Continue Learning</span>
                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination / Load More */}
            <div className="mt-12 flex justify-center">
                <button className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-white transition-colors bg-card-dark border border-card-border px-6 py-3 rounded-lg hover:bg-card-border">
                    <span>Load More Modules</span>
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </button>
            </div>
        </>
    );
};
