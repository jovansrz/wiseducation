import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => {
    return (
        <aside className="hidden w-64 flex-col justify-between border-r border-card-border bg-background-dark p-4 lg:flex overflow-y-auto">
            <div className="flex flex-col gap-4">
                {/* Logo Area */}
                {/* Logo Area */}
                <div className="flex items-center gap-3 px-2 py-2 mb-4">
                    <img src="/wise-logo.png" alt="WISE Logo" className="h-10 w-10 object-contain" />
                    <div className="flex flex-col">
                        <h1 className="text-white text-lg font-bold tracking-tight leading-none">WISE</h1>
                        <p className="text-text-secondary text-xs font-medium leading-none mt-1">Investing & Edu</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-2">
                    <NavLink to="/" className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-text-secondary hover:bg-card-border hover:text-white'}`}>
                        <span className="material-symbols-outlined filled-icon">home</span>
                        <span className="text-sm font-medium">Home</span>
                    </NavLink>
                    <NavLink to="/education" className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-text-secondary hover:bg-card-border hover:text-white'}`}>
                        <span className="material-symbols-outlined">school</span>
                        <span className="text-sm font-medium">Edukasi</span>
                    </NavLink>
                    <NavLink to="/market" className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-text-secondary hover:bg-card-border hover:text-white'}`}>
                        <span className="material-symbols-outlined">candlestick_chart</span>
                        <span className="text-sm font-medium">Simulasi</span>
                    </NavLink>
                    <NavLink to="/game" className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-text-secondary hover:bg-card-border hover:text-white'}`}>
                        <span className="material-symbols-outlined">sports_esports</span>
                        <span className="text-sm font-medium">Game</span>
                    </NavLink>
                    <NavLink to="/mentoring" className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-text-secondary hover:bg-card-border hover:text-white'}`}>
                        <span className="material-symbols-outlined">verified_user</span>
                        <span className="text-sm font-medium">Mentor</span>
                    </NavLink>
                    <NavLink to="/ai-assistant" className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-text-secondary hover:bg-card-border hover:text-white'}`}>
                        <span className="material-symbols-outlined">smart_toy</span>
                        <span className="text-sm font-medium">AI Bot</span>
                    </NavLink>
                    <NavLink to="/community" className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-text-secondary hover:bg-card-border hover:text-white'}`}>
                        <span className="material-symbols-outlined">diversity_3</span>
                        <span className="text-sm font-medium">Community</span>
                    </NavLink>
                </nav>
            </div>

            {/* User Mini Profile Bottom */}
            <div className="mt-auto border-t border-card-border pt-4">
                <div className="flex items-center gap-3 rounded-lg p-2 hover:bg-card-border cursor-pointer transition-colors">
                    <div
                        className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-primary"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdGNWE5TwCUDIZj3w_J9IAlxKCyoB0ARC99-DQ5QLJIt71JwS2z9DZWpQ5-QvnmS43j47y_Uv7mtR0fQNtSXvCaCcBg4-zplfz4vKQoZq5Pc2Ut-oEkVTYiHjIiUQnKycv-kFG0ssp5PdHOUsaOgsa2yGU7W_OgXv6vswjqDTJbLL9E5YpwYMuTkds8IHCoS6JR4kSk1hM1UeOci2ZvDnf_6d0FaYSkCsp3n1fYvY1Clq80FRzFG6-TSklq50St-e7-TGH0l03KVs')" }}
                    ></div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="truncate text-sm font-medium text-white">Rizky Investor</p>
                        <p className="truncate text-xs text-text-secondary">Pro Plan</p>
                    </div>
                    <span className="material-symbols-outlined ml-auto text-text-secondary text-[20px]">more_vert</span>
                </div>
            </div>
        </aside>
    );
};
