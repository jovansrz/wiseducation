import React from 'react';

export const Mentoring: React.FC = () => {
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col group/design-root bg-background-light dark:bg-background-dark font-display text-white overflow-x-hidden antialiased">
            <div className="layout-container flex h-full grow flex-col">
                {/* Main Content Container with Padding */}
                <div className="px-4 md:px-12 lg:px-40 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
                        {/* Header */}
                        <header className="flex items-center justify-end whitespace-nowrap border-b border-solid border-b-[#2b3635] px-4 lg:px-10 py-3 mb-6">
                            <div className="flex gap-2">
                                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary/90 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em]">
                                    <span className="truncate">Profile</span>
                                </button>
                                <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#2b3635] hover:bg-[#374544] transition-colors text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                                </button>
                            </div>
                        </header>
                        {/* Page Heading */}
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <div className="flex min-w-72 flex-col gap-3">
                                <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Mentoring Hub</p>
                                <p className="text-text-secondary text-base font-normal leading-normal">Connect with top financial experts to accelerate your investment journey.</p>
                            </div>
                        </div>
                        {/* Featured Mentor Section (Hero) */}
                        <div className="p-4">
                            <div className="relative overflow-hidden rounded-2xl bg-card-dark border border-[#2b3635] shadow-lg">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative flex flex-col md:flex-row p-6 md:p-8 gap-8 items-start">
                                    {/* Featured Tag */}
                                    <div className="absolute top-4 right-4 bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <span className="material-symbols-outlined filled text-[14px]">star</span> Featured Mentor
                                    </div>
                                    {/* Image */}
                                    <div className="w-full md:w-1/3 shrink-0">
                                        <div className="aspect-[4/5] md:aspect-square rounded-xl overflow-hidden bg-gray-800 relative shadow-inner">
                                            <img className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" data-alt="Portrait of Sarah Jenkins, a professional financial expert looking confident in a business suit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaL_suohs-kHmI4nXj4oIcYGpMxUQ5GIh4HymKMT9RNCqBsz8qSPQog8DO2Yba2j1h8N3Xqx_OI37yF4WIyvLQeLMwGUy38hSHW4rqtEbk5JV2X--lGX-QDM1kgdEBGxvUfuaDAAp1dFfLapyZiQpddTI6C3Mdz3dT1AUyXmUa8PDR63fiGK0CU_-ut0wYmjbFRrBiEVISrEZDHBQvXzarHT6TW-yn6VLfCUaBB3F7Mmye0tlyjcW4DZBmZnODZM4wCwEGgfm5ga0" />
                                        </div>
                                    </div>
                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-center h-full gap-4 w-full">
                                        <div>
                                            <h3 className="text-3xl font-bold text-white mb-1">Sarah Jenkins</h3>
                                            <p className="text-primary font-medium text-lg">Forex & Global Markets Strategist</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-text-secondary">
                                            <div className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[18px]">verified</span>
                                                Verified Expert
                                            </div>
                                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                                            <div className="flex items-center gap-1 text-[#fbbf24]">
                                                <span className="material-symbols-outlined filled text-[18px]">star</span>
                                                <span className="font-bold text-white">4.98</span> (320 Reviews)
                                            </div>
                                        </div>
                                        <p className="text-gray-300 leading-relaxed max-w-lg">
                                            With over 15 years on Wall Street, I specialize in risk management and active investment strategies for volatile markets. My students average a 240% portfolio growth in their first year.
                                        </p>
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-3 gap-4 border-y border-[#3a4746] py-4 my-2">
                                            <div>
                                                <p className="text-2xl font-bold text-white">15+</p>
                                                <p className="text-xs text-text-secondary uppercase tracking-wider">Years Exp.</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-white">1.2k</p>
                                                <p className="text-xs text-text-secondary uppercase tracking-wider">Students</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-primary">+240%</p>
                                                <p className="text-xs text-text-secondary uppercase tracking-wider">Avg Return</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                                Book Consultation
                                                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                            </button>
                                            <span className="text-white font-bold text-lg">$350<span className="text-text-secondary font-normal text-sm">/hr</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Search Bar */}
                        <div className="px-4 py-3 mt-4">
                            <label className="flex flex-col min-w-40 h-12 w-full">
                                <div className="flex w-full flex-1 items-stretch rounded-lg h-full group focus-within:ring-1 focus-within:ring-primary transition-all">
                                    <div className="text-text-secondary flex border-none bg-card-dark items-center justify-center pl-4 rounded-l-lg border-r-0">
                                        <span className="material-symbols-outlined">search</span>
                                    </div>
                                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-card-dark focus:border-none h-full placeholder:text-text-secondary px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search mentors by name, specialty, or keyword..." />
                                </div>
                            </label>
                        </div>
                        {/* Filter Chips */}
                        <div className="flex gap-3 px-4 pb-4 flex-wrap overflow-x-auto no-scrollbar">
                            <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-primary text-white pl-4 pr-4 transition-colors">
                                <p className="text-sm font-bold leading-normal">All Mentors</p>
                            </div>
                            <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-card-dark hover:bg-[#374544] pl-4 pr-4 transition-colors">
                                <p className="text-white text-sm font-medium leading-normal">Stock Analysis</p>
                            </div>
                            <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-card-dark hover:bg-[#374544] pl-4 pr-4 transition-colors">
                                <p className="text-white text-sm font-medium leading-normal">Crypto</p>
                            </div>
                            <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-card-dark hover:bg-[#374544] pl-4 pr-4 transition-colors">
                                <p className="text-white text-sm font-medium leading-normal">Forex</p>
                            </div>
                            <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-card-dark hover:bg-[#374544] pl-4 pr-4 transition-colors">
                                <p className="text-white text-sm font-medium leading-normal">Personal Finance</p>
                            </div>
                            <div className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-x-2 rounded-lg bg-card-dark hover:bg-[#374544] pl-4 pr-4 transition-colors">
                                <p className="text-white text-sm font-medium leading-normal">Tax Strategy</p>
                            </div>
                        </div>
                        {/* Section Header */}
                        <div className="flex items-center justify-between px-4 pb-3 pt-5">
                            <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">Available Mentors</h2>
                            <div className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer hover:text-white">
                                <span>Sort by: Recommended</span>
                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                            </div>
                        </div>
                        {/* Mentors Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4 pb-8">
                            {/* Mentor Card 1 */}
                            <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Portrait of David Chen, a financial analyst smiling in a modern office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7XNjtM2c2OH-1EnM1H49AHa5hBvVQaPZmWGToGyreIi33xJoa9OiTxsto57FHgtksH4xARHuq47fKTu1atLUilj3TgKbFKKEIsEk7BgNs0haQsQH3nLkgc2gn8-0RJR8Jo4Duqg5guOBFf4f32nStTI6RS8cvomXpsBk79Av8Ju2tGYuC30wAjXXTWX-sKkypr7bylF3IMh2-N4eE1e6P7W9neJcW_VHD7SDm73U1l2V_mPaX3QtrYCyulMbRPO5a-ti2MABlPuQ" />
                                    <div className="absolute top-3 right-3 bg-[#121716]/80 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                                        <span className="material-symbols-outlined filled text-[#fbbf24] text-[16px]">star</span>
                                        <span className="text-white text-xs font-bold">4.9</span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 p-5 gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">David Chen</h3>
                                        <p className="text-text-secondary text-sm">Crypto & DeFi Analyst</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded bg-[#121716] text-text-secondary text-[10px] font-medium uppercase tracking-wide">Bitcoin</span>
                                        <span className="px-2 py-1 rounded bg-[#121716] text-text-secondary text-[10px] font-medium uppercase tracking-wide">Blockchain</span>
                                    </div>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#3a4746]">
                                        <div>
                                            <p className="text-xs text-text-secondary">Hourly Rate</p>
                                            <p className="text-white font-bold text-lg">$200</p>
                                        </div>
                                        <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Mentor Card 2 */}
                            <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Portrait of Maria Rodriguez, a professional advisor standing with arms crossed" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdhUtqNSgfLlrMPql81KhGrztTwubkpC1AMgx8kDfnETYW9Yjs1smkF4wrQ1YyhVRoRjuDnT0G4moLqjD9wcRgnbNKcWUTbgba4nYo-RconGe8sqcSAql2yzPNSRuYesJZsk7eyAVhgt9hLpAgmGg_m-8K1CZy8_7I_K64rZse20jyTjVskMWsXvqyLAyWNb0NLSlg6yRl6iMYf73ivzwpHlaKrOOVPLWUOr9sF4TjCdBitfXmbiq-vOrRvSl-mj0gXM4d8KANynw" />
                                    <div className="absolute top-3 right-3 bg-[#121716]/80 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                                        <span className="material-symbols-outlined filled text-[#fbbf24] text-[16px]">star</span>
                                        <span className="text-white text-xs font-bold">4.8</span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 p-5 gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Maria Rodriguez</h3>
                                        <p className="text-text-secondary text-sm">ETF & Mutual Funds Specialist</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded bg-[#121716] text-text-secondary text-[10px] font-medium uppercase tracking-wide">Long-term</span>
                                        <span className="px-2 py-1 rounded bg-[#121716] text-text-secondary text-[10px] font-medium uppercase tracking-wide">Retirement</span>
                                    </div>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#3a4746]">
                                        <div>
                                            <p className="text-xs text-text-secondary">Hourly Rate</p>
                                            <p className="text-white font-bold text-lg">$120</p>
                                        </div>
                                        <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Mentor Card 3 */}
                            <div className="group flex flex-col bg-card-dark rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="Portrait of James Wilson, a focused businessman in a grey suit" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMvzR1Yc6R1IEmwUFv1T5tBmDY_UnNAwBmexQyV60x6bizeua2xnbL2b4_5Y8BYRmqRAF6BArGTepySKmBWDpehLBXwSlFBYCQEgyT_QU0HtSsCDFljyiEF5J0wzrvpWRsrDCpKKbcViwbpcXzW0nEBpvHfA3qe0dretl_MWDNfCGqaYWRarPW7Kv5ex0bz-uZieRngAtPFgx8EmMzmGqoSSRV9Smbtw5lgL6rWdnY0GzCbPPBwIlzDSEuJWmBVqHuMws8_Ya7-gg" />
                                    <div className="absolute top-3 right-3 bg-[#121716]/80 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1 border border-white/10">
                                        <span className="material-symbols-outlined filled text-[#fbbf24] text-[16px]">star</span>
                                        <span className="text-white text-xs font-bold">5.0</span>
                                    </div>
                                </div>
                                <div className="flex flex-col flex-1 p-5 gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">James Wilson</h3>
                                        <p className="text-text-secondary text-sm">Technical Analysis Coach</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded bg-[#121716] text-text-secondary text-[10px] font-medium uppercase tracking-wide">Active Investing</span>
                                        <span className="px-2 py-1 rounded bg-[#121716] text-text-secondary text-[10px] font-medium uppercase tracking-wide">Swing</span>
                                    </div>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#3a4746]">
                                        <div>
                                            <p className="text-xs text-text-secondary">Hourly Rate</p>
                                            <p className="text-white font-bold text-lg">$300</p>
                                        </div>
                                        <button className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Load More */}
                        <div className="flex justify-center pb-8">
                            <button className="text-text-secondary hover:text-white font-medium flex items-center gap-2 transition-colors">
                                Load more mentors
                                <span className="material-symbols-outlined">expand_more</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
