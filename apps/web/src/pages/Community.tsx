import React from 'react';

export const Community: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark text-[#111418] dark:text-white font-display overflow-x-hidden min-h-screen flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#2b3635] bg-surface-dark/95 backdrop-blur-md px-4 sm:px-10 py-3">
                <div className="flex items-center gap-8 w-full max-w-[1440px] mx-auto">
                    {/* Search */}
                    <label className="flex flex-col min-w-40 !h-10 max-w-md flex-1 hidden md:flex">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-[#a1b5b3] flex border-none bg-[#2b3635] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined text-[24px]">search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#2b3635] focus:border-none h-full placeholder:text-[#a1b5b3] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal" placeholder="Search tickers, topics, or users..." />
                        </div>
                    </label>
                    {/* Right Actions */}
                    <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
                        <button className="flex items-center justify-center overflow-hidden rounded-lg h-10 w-10 bg-[#2b3635] text-white hover:bg-[#384645] transition-colors relative">
                            <span className="material-symbols-outlined text-[20px]">notifications</span>
                            <div className="absolute top-2 right-2 size-2 bg-primary rounded-full"></div>
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-transparent hover:ring-primary transition-all" data-alt="User profile picture showing a confident professional" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDeI8M4LSdVn4-1ZEl02HcG4CPcrvOHP7DPqAPjqG4nD1a-227u0z1W5k4F4S2M_H3f9REgjsiFL9D8ISdldBX5IKKXksV7u2AAqdq-W5lfk8FosjCt4fSwy_phC9Z08bKvm2I-hENeNUQSwz30o2_kBKIAl4IE4xb4Lw5fSU3vA8srTeitzkDk70jvgOXnr2zgNnnUiFqj6M1GdUJ6Liq-RjwCQGdeTSEK1izjzbXD6nlD-rHvWGjOONH-FTALB7dgcFSD61uegV0')" }}></div>
                        </div>
                    </div>
                </div>
            </header>
            {/* Main Layout */}
            <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 w-full max-w-[1440px] mx-auto gap-6">
                {/* Left Sidebar (Navigation) */}
                <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                    {/* Primary Action */}
                    <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-[#238c82] transition-colors text-white gap-2 text-base font-bold leading-normal shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[24px]">add</span>
                        <span className="truncate">Start a Discussion</span>
                    </button>
                    {/* Navigation Links */}
                    <div className="flex flex-col gap-2">
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#2b3635]/50 text-white hover:bg-[#2b3635] transition-colors border-l-4 border-primary">
                            <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                            <span className="font-bold">My Feed</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#a1b5b3] hover:text-white hover:bg-[#2b3635] transition-colors">
                            <span className="material-symbols-outlined">explore</span>
                            <span className="font-medium">Discover</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#a1b5b3] hover:text-white hover:bg-[#2b3635] transition-colors">
                            <span className="material-symbols-outlined">bookmark</span>
                            <span className="font-medium">Saved</span>
                        </a>
                    </div>
                    {/* Categories */}
                    <div className="flex flex-col">
                        <h3 className="text-[#a1b5b3] text-xs font-bold uppercase tracking-wider px-3 pb-3 pt-2">Communities</h3>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg group hover:bg-[#2b3635] transition-colors">
                            <div className="text-white flex items-center justify-center rounded-md bg-[#2b3635] group-hover:bg-[#364443] shrink-0 size-8 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">candlestick_chart</span>
                            </div>
                            <p className="text-white text-sm font-medium leading-normal flex-1 truncate">StockTalk</p>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg group hover:bg-[#2b3635] transition-colors">
                            <div className="text-white flex items-center justify-center rounded-md bg-[#2b3635] group-hover:bg-[#364443] shrink-0 size-8 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">currency_bitcoin</span>
                            </div>
                            <p className="text-white text-sm font-medium leading-normal flex-1 truncate">CryptoCorner</p>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg group hover:bg-[#2b3635] transition-colors">
                            <div className="text-white flex items-center justify-center rounded-md bg-[#2b3635] group-hover:bg-[#364443] shrink-0 size-8 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">school</span>
                            </div>
                            <p className="text-white text-sm font-medium leading-normal flex-1 truncate">BeginnerTips</p>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg group hover:bg-[#2b3635] transition-colors">
                            <div className="text-white flex items-center justify-center rounded-md bg-[#2b3635] group-hover:bg-[#364443] shrink-0 size-8 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">newspaper</span>
                            </div>
                            <p className="text-white text-sm font-medium leading-normal flex-1 truncate">MarketNews</p>
                        </a>
                    </div>
                    {/* Resources */}
                    <div className="flex flex-col">
                        <h3 className="text-[#a1b5b3] text-xs font-bold uppercase tracking-wider px-3 pb-3 pt-2">Resources</h3>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#a1b5b3] hover:text-white hover:bg-[#2b3635] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">menu_book</span>
                            <span className="font-medium text-sm">WISE Academy</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#a1b5b3] hover:text-white hover:bg-[#2b3635] transition-colors">
                            <span className="material-symbols-outlined text-[20px]">help</span>
                            <span className="font-medium text-sm">Help Center</span>
                        </a>
                    </div>
                </aside>
                {/* Center Feed */}
                <main className="flex flex-col flex-1 min-w-0 gap-6">
                    {/* Feed Filters */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-[#2b3635] text-white rounded-full text-sm font-bold hover:bg-[#384645] transition-colors border border-primary/30 text-primary">Trending</button>
                            <button className="px-4 py-2 hover:bg-[#2b3635] text-[#a1b5b3] hover:text-white rounded-full text-sm font-bold transition-colors">New</button>
                            <button className="px-4 py-2 hover:bg-[#2b3635] text-[#a1b5b3] hover:text-white rounded-full text-sm font-bold transition-colors">Top</button>
                        </div>
                        <button className="text-[#a1b5b3] hover:text-white flex items-center gap-1 text-sm font-medium">
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                            Filter
                        </button>
                    </div>
                    {/* Create Post Input */}
                    <div className="flex gap-4 p-4 rounded-xl bg-surface-dark border border-[#2b3635]">
                        <div className="size-10 rounded-full bg-cover bg-center shrink-0" data-alt="User avatar small" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9HUc1_vVKjURxHcCE5i9yMrxZyKTFX0sfZmuTlJlO5JlYDBeGIzXl8pl3moT4eBezcBV07vDQSrEOEE-BIFvHDYocLi860qzPsGTPljCD6ETIHniNixamaxSIabUMzy8kIEL3OgfIOTa6sAG_PoGK64oBfPR9LUt4LOiWV2_hlukMkzrGGIYbVdZB_CjCt3IURsUY2zk3ficG1XGPWcXh36BCcNFsU7g7OLur0uFarzYflADg9V4FVvXGXN1xx4XetSfzIGByr54')" }}></div>
                        <div className="flex-1">
                            <input className="w-full bg-[#2b3635] border-none rounded-lg px-4 py-2.5 text-white placeholder-[#a1b5b3] focus:ring-1 focus:ring-primary mb-3" placeholder="Share your market insights..." type="text" />
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button className="text-[#a1b5b3] hover:text-primary p-1"><span className="material-symbols-outlined text-[20px]">image</span></button>
                                    <button className="text-[#a1b5b3] hover:text-primary p-1"><span className="material-symbols-outlined text-[20px]">bar_chart</span></button>
                                    <button className="text-[#a1b5b3] hover:text-primary p-1"><span className="material-symbols-outlined text-[20px]">poll</span></button>
                                </div>
                                <button className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">Post</button>
                            </div>
                        </div>
                    </div>
                    {/* Post 1: Chart Analysis */}
                    <article className="flex flex-col gap-4 p-5 rounded-xl bg-surface-dark border border-[#2b3635] hover:border-primary/20 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className="size-10 rounded-full bg-cover bg-center" data-alt="User avatar for SarahTradez" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4k052xr98QDIgsHIESN3bXobXKgrP_-ACedOYbZH2tvdoYS5if0RSdVZ2QmoBEA5yUgO5s5K7-2pgrBYr22jeSTArZvAQeripOPBRSVuSbxP4STwnCJubQphuGNZWZsbFctatcupb1Bt9fdk-LtnNMSW8zrKQSaAcxkNbnE4YMz11P8TfBAok2WnyfheoaprhXVFqmCQzOFntUXNTp__vH7yrB4cHh2i7jHtHmaNynd9thEerfByYHivoiyIupNcMH-BanLOouGY')" }}></div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm">SarahTradez</span>
                                        <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold uppercase">Pro</span>
                                        <span className="text-[#a1b5b3] text-xs">• 2h ago</span>
                                    </div>
                                    <span className="text-[#a1b5b3] text-xs font-medium">in #StockTalk</span>
                                </div>
                            </div>
                            <button className="text-[#a1b5b3] hover:text-white"><span className="material-symbols-outlined">more_horiz</span></button>
                        </div>
                        <div>
                            <h3 className="text-white text-lg font-bold mb-2">Analyzing TSLA's Q3 earnings - Bullish setup? 🚀</h3>
                            <p className="text-[#d1dcdb] text-sm leading-relaxed mb-4">
                                Looking at the daily chart, we're seeing a clear cup and handle formation. With the delivery numbers beating expectations, I think we break resistance at $250. Thoughts?
                            </p>
                            <div className="w-full h-64 rounded-lg bg-[#2b3635] relative overflow-hidden group cursor-pointer border border-[#384645]">
                                <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:scale-105 transition-transform duration-500" data-alt="Stock chart showing upward trend with green candles" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDBHJzKWCNAGPW8K4LFoPlnDXDUA8mxCXzoDcVDTut_dV85Nt--OMGAXZLRb-HbfYmND1XVLPDUG9nZh-3c_dX0LqtJ8D6Up4hMAxLjVEw_Nl7mi2l4UxfOxKEMhFLonDc6IVy7LkXtza3dxb5-_W5cb9beOv4UX5-zn35wnb49kL1rE9B58xCo8FDDxdT80FLdu7e7SZBg0tGVXK_e4AyOIFFaDHouFQGwv7pI-KphoxHEwll9_dkC03IkROpk5mpaUd14cYlGetw')" }}></div>
                                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-white text-xs font-mono">TSLA $248.50</div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">Bullish</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#2b3635] text-[#a1b5b3]">$TSLA</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-[#2b3635] text-[#a1b5b3]">Technical Analysis</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-[#2b3635] pt-3 mt-1">
                            <div className="flex gap-4">
                                <div className="flex items-center bg-[#2b3635] rounded-lg p-1">
                                    <button className="p-1 hover:text-primary text-[#a1b5b3] transition-colors"><span className="material-symbols-outlined text-[20px]">arrow_upward</span></button>
                                    <span className="px-2 text-sm font-bold text-white">245</span>
                                    <button className="p-1 hover:text-red-400 text-[#a1b5b3] transition-colors"><span className="material-symbols-outlined text-[20px]">arrow_downward</span></button>
                                </div>
                                <button className="flex items-center gap-1.5 text-[#a1b5b3] hover:text-white transition-colors text-sm font-medium">
                                    <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                    42 Comments
                                </button>
                                <button className="flex items-center gap-1.5 text-[#a1b5b3] hover:text-white transition-colors text-sm font-medium">
                                    <span className="material-symbols-outlined text-[20px]">share</span>
                                    Share
                                </button>
                            </div>
                        </div>
                    </article>
                    {/* Post 2: Poll Widget */}
                    <article className="flex flex-col gap-4 p-5 rounded-xl bg-surface-dark border border-[#2b3635]">
                        <div className="flex items-center gap-3 mb-1">
                            <div className="size-10 rounded-full bg-cover bg-center" data-alt="User avatar for MarketWizard" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFCsipuUtBzkWkg9OF728Hdr42nza1-IVKMr0qBtBp4sG_K-GB6nFBR1M9_Rn8EywqZQf0Ut6rcGWQ1uGkoKcXtrZHIfmLG6dOHlNnS0MYcGf6Uoff14FR5wD7BmbgJJCwedn_CxvmThiYe9b8uFryxqcejW6-PMZkHhJsn69azqln4gZPZRs5821xPVdG8GhSaHmj9_cfIYQhl6CsPpv9cl2nuSL1NeSh6Gcbj8PZkOi1rls5bdnUSfZaW8CfPv4xvWCyS_lgYJ8')" }}></div>
                            <div className="flex flex-col">
                                <span className="text-white font-bold text-sm">MarketWizard</span>
                                <span className="text-[#a1b5b3] text-xs">Asked in #MarketNews • 4h ago</span>
                            </div>
                        </div>
                        <h3 className="text-white text-lg font-bold">Poll: Will the Fed raise rates in the next meeting? 🏦</h3>
                        <div className="flex flex-col gap-3">
                            <div className="relative group cursor-pointer">
                                <div className="flex justify-between text-sm font-medium text-white mb-1 relative z-10 px-3 pt-2">
                                    <span>Yes, definitely (25bps)</span>
                                    <span>62%</span>
                                </div>
                                <div className="h-10 w-full bg-[#2b3635] rounded-lg overflow-hidden relative">
                                    <div className="h-full bg-primary/40 w-[62%] absolute top-0 left-0 rounded-l-lg"></div>
                                    <div className="absolute inset-0 hover:bg-white/5 transition-colors"></div>
                                </div>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="flex justify-between text-sm font-medium text-white mb-1 relative z-10 px-3 pt-2">
                                    <span>No, they will pause</span>
                                    <span>28%</span>
                                </div>
                                <div className="h-10 w-full bg-[#2b3635] rounded-lg overflow-hidden relative">
                                    <div className="h-full bg-[#2b3635] w-[28%] absolute top-0 left-0 rounded-l-lg"></div>
                                    <div className="absolute inset-0 hover:bg-white/5 transition-colors"></div>
                                </div>
                            </div>
                            <div className="relative group cursor-pointer">
                                <div className="flex justify-between text-sm font-medium text-white mb-1 relative z-10 px-3 pt-2">
                                    <span>They might cut rates</span>
                                    <span>10%</span>
                                </div>
                                <div className="h-10 w-full bg-[#2b3635] rounded-lg overflow-hidden relative">
                                    <div className="h-full bg-[#2b3635] w-[10%] absolute top-0 left-0 rounded-l-lg"></div>
                                    <div className="absolute inset-0 hover:bg-white/5 transition-colors"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-[#a1b5b3] text-xs">1,204 votes • 2 days left</span>
                            <button className="text-primary text-sm font-bold hover:underline">View Discussion</button>
                        </div>
                    </article>
                </main>
                {/* Right Sidebar (Widgets) */}
                <aside className="hidden xl:flex flex-col w-80 shrink-0 gap-6 sticky top-24 h-[calc(100vh-6rem)]">
                    {/* Top Contributors Widget */}
                    <div className="bg-surface-dark rounded-xl border border-[#2b3635] p-5 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-bold text-base">Top Contributors</h3>
                            <a href="#" className="text-primary text-xs font-bold hover:underline">View All</a>
                        </div>
                        <div className="flex flex-col gap-4">
                            {/* User 1 */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="size-10 rounded-full bg-cover bg-center" data-alt="Avatar of top contributor 1" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC1mvpmemMy6cMkExGE_n5fM73eDh8AFCKTb_IkSY3vv83KVWv7m6rRULntCMyXzY_w29Xpmz_tztiw81wrRyGhNOWkkIDn59UzlWnKW20EuLRDjwWJRKCs2RiQyZI2AMnwnEUIC7zR9szEjZlTBApV8494rMxXb8_VuUBFvC7ZLH7d3Af1AnIoTdaZyyfXSt15jglhnC46poXoQZMJi-cqjsZ5PATsUIdbwDjmVubGBpZGJvKBUzb2mjiSXnrBeREGX7BPvOv2ep8')" }}></div>
                                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">1</div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-white text-sm font-bold">DavidAlpha</span>
                                    <span className="text-[#a1b5b3] text-xs">15.4k Rep Points</span>
                                </div>
                                <button className="text-primary hover:text-white p-1 rounded hover:bg-[#2b3635] transition-colors"><span className="material-symbols-outlined text-[20px]">person_add</span></button>
                            </div>
                            {/* User 2 */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="size-10 rounded-full bg-cover bg-center" data-alt="Avatar of top contributor 2" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGjNG5akHRUGSo9jO-n-aUnI5yq6wUfchuokUFpdgPB_90J8aouNPB0riLtuxE3Cwglc0rFeQA4caMzfY-a1KXNZVf2o0nViTs9TwasEAjKqbe6XHAzq8VM1zuKlm6dDBYYV6YomPP5I5__Iq8vW8hb388BTswmhTsvpiUc5dxrtu8twf2advlzZNN3iVRP4N5-xEZzq6FLNsuGBXr07iNN2vpm2DDekGFZXgfgJ9sV2KuQ72lscnSUr7FmYUA3bqfZiws3jvP7fE')" }}></div>
                                    <div className="absolute -top-1 -right-1 bg-gray-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">2</div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-white text-sm font-bold">ElenaCharts</span>
                                    <span className="text-[#a1b5b3] text-xs">12.8k Rep Points</span>
                                </div>
                                <button className="text-primary hover:text-white p-1 rounded hover:bg-[#2b3635] transition-colors"><span className="material-symbols-outlined text-[20px]">person_add</span></button>
                            </div>
                            {/* User 3 */}
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="size-10 rounded-full bg-cover bg-center" data-alt="Avatar of top contributor 3" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVOsnYYPe60GIfhTnub_XrC2XZ8PBTAtbs-pnmTB2ouV62iob0HIef5SpEk41CvRX9KsO9Fm8fmQgrRCkEo3KAFA-EWnMjNASJXdRqLYKHHte9MqDywwcPqsfmicfUs_BI1Ux5aS5nueOEu6qbkYyK4rNrnX23ppIIm4xudSzEh9vOjQVw3IDjt6MdmsfceQvb8J2MoKuMstvW2K0FL79DkwSJQ96NgPUCyCBo-sZ1MewZqX7PxzH6ly_oaZzb7G4yjLuMi-niyvE')" }}></div>
                                    <div className="absolute -top-1 -right-1 bg-orange-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</div>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-white text-sm font-bold">QuantMaster</span>
                                    <span className="text-[#a1b5b3] text-xs">10.1k Rep Points</span>
                                </div>
                                <button className="text-primary hover:text-white p-1 rounded hover:bg-[#2b3635] transition-colors"><span className="material-symbols-outlined text-[20px]">person_add</span></button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
            {/* Sticky Mobile Action Button (Visible only on small screens) */}
            <div className="fixed bottom-6 right-6 lg:hidden">
                <button className="size-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">add</span>
                </button>
            </div>
        </div>
    );
};
