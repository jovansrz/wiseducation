import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="flex h-16 items-center justify-between border-b border-card-border bg-background-dark/80 px-6 backdrop-blur-md sticky top-0 z-20">
            {/* Mobile Menu Toggle */}
            <button className="lg:hidden mr-4 text-text-secondary hover:text-white">
                <span className="material-symbols-outlined">menu</span>
            </button>

            {/* Balance Display (Desktop) */}
            <div className="hidden md:flex items-center gap-3 rounded-lg bg-card-dark border border-card-border px-4 py-1.5">
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-text-secondary tracking-wider">Virtual Balance</span>
                    <span className="text-sm font-bold text-white tracking-wide">Rp 10,000,000</span>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mx-4 flex max-w-md flex-1 items-center rounded-lg bg-card-dark px-3 py-2 border border-card-border focus-within:border-primary/50 transition-colors">
                <span className="material-symbols-outlined text-text-secondary text-[20px]">search</span>
                <input
                    className="ml-2 flex-1 bg-transparent text-sm text-white placeholder-text-secondary focus:outline-none border-none ring-0 p-0"
                    placeholder="Search markets, lessons..."
                    type="text"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="relative rounded-lg p-2 text-text-secondary hover:bg-card-border hover:text-white transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border border-background-dark"></span>
                </button>
                <div
                    className="md:hidden h-8 w-8 rounded-full bg-cover bg-center border border-card-border"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-iy36HAU3eVnROl2WrS6wZdNDbxAa9MdaSrPpzyAMpYZWwhFl63NTZI0ykoxWG7ZpAei-zmRiV22RqTCXHwq_Iad9XGiOebl5IvAquwjqLM8bZVftECCj2jxNeLQcDJpIEN8VLESyL7g4U_Fsn0AbFUJrK8rBwx9mXITwJxb9jFN_tMavzECfOvO5S_QrxVtTrh2nrUocwmyZJylgbL7jnTRgkEqu4pFT_oJ-Ayda4JPThuG2xTMUUqmz_XeUuOlcj_acF1KOVc0')" }}
                ></div>
            </div>
        </header>
    );
};
