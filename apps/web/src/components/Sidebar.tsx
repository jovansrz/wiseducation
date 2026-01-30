import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

// Avatar options for profile customization
const AVATAR_OPTIONS = [
    { id: 'default', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor1' },
    { id: 'investor2', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor2' },
    { id: 'investor3', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor3' },
    { id: 'investor4', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor4' },
    { id: 'investor5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor5' },
    { id: 'investor6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=investor6' },
    { id: 'bull', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=bull' },
    { id: 'bear', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=bear' },
];

export const Sidebar: React.FC = () => {
    const { data: session } = authClient.useSession();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(() => {
        // Load saved avatar from localStorage
        const saved = localStorage.getItem('wise_user_avatar');
        return saved || AVATAR_OPTIONS[0].url;
    });

    const userName = session?.user?.name || 'Investor';
    const userEmail = session?.user?.email || '';

    const handleLogout = async () => {
        await authClient.signOut();
        window.location.href = '/';
    };

    const handleAvatarSelect = (avatarUrl: string) => {
        setSelectedAvatar(avatarUrl);
        localStorage.setItem('wise_user_avatar', avatarUrl);
        setShowProfileModal(false);
    };

    return (
        <>
            <aside className="hidden w-64 flex-col justify-between border-r border-card-border bg-background-dark p-4 lg:flex overflow-y-auto">
                <div className="flex flex-col gap-4">
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
                <div className="mt-auto border-t border-card-border pt-4 relative">
                    <div
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-card-border cursor-pointer transition-colors"
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                    >
                        <div
                            className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-primary bg-card-dark flex items-center justify-center overflow-hidden"
                        >
                            <img src={selectedAvatar} alt="Avatar" className="h-full w-full object-cover" />
                        </div>
                        <div className="flex flex-col overflow-hidden flex-1">
                            <p className="truncate text-sm font-medium text-white">{userName}</p>
                            <p className="truncate text-xs text-text-secondary">{userEmail ? 'Pro Plan' : 'Guest'}</p>
                        </div>
                        <span className="material-symbols-outlined text-text-secondary text-[20px]">
                            {showProfileMenu ? 'expand_less' : 'expand_more'}
                        </span>
                    </div>

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 bg-card-dark border border-card-border rounded-lg shadow-xl overflow-hidden z-50">
                            <button
                                onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-card-border transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px] text-primary">account_circle</span>
                                Customize Profile
                            </button>
                            <div className="border-t border-card-border"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </aside>

            {/* Profile Customization Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}></div>
                    <div className="relative w-full max-w-md bg-card-dark border border-card-border rounded-2xl shadow-2xl p-6 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Customize Profile</h2>
                            <button
                                onClick={() => setShowProfileModal(false)}
                                className="text-text-secondary hover:text-white transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Current Avatar */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="h-24 w-24 rounded-full border-4 border-primary bg-card-dark overflow-hidden mb-3">
                                <img src={selectedAvatar} alt="Current Avatar" className="h-full w-full object-cover" />
                            </div>
                            <p className="text-lg font-bold text-white">{userName}</p>
                            <p className="text-sm text-text-secondary">{userEmail}</p>
                        </div>

                        {/* Avatar Selection */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-text-secondary uppercase mb-3">Choose Avatar</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {AVATAR_OPTIONS.map((avatar) => (
                                    <button
                                        key={avatar.id}
                                        onClick={() => handleAvatarSelect(avatar.url)}
                                        className={`h-14 w-14 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${selectedAvatar === avatar.url
                                                ? 'border-primary ring-2 ring-primary/30'
                                                : 'border-card-border hover:border-primary/50'
                                            }`}
                                    >
                                        <img src={avatar.url} alt={avatar.id} className="h-full w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <p className="text-xs text-text-secondary text-center">
                            Your avatar is saved locally on this device.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};
