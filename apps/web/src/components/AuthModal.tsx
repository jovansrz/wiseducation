import React, { useState } from 'react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-md bg-[#162e2b] border border-[#30b8aa]/20 rounded-2xl shadow-2xl p-8 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#30b8aa] to-transparent"></div>

                <div className="text-center mb-8">
                    <img src="/wise-logo.png" alt="WISE Logo" className="h-12 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Join WISE Today'}</h2>
                    <p className="text-gray-400 text-sm">
                        {isLogin ? 'Enter your credentials to access your portfolio.' : 'Start your journey to financial mastery.'}
                    </p>
                </div>

                <div className="flex bg-[#0f1f1e] p-1 rounded-lg mb-6">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-[#30b8aa] text-[#0f1f1e] shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Log In
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-[#30b8aa] text-[#0f1f1e] shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                            type="email"
                            className="w-full bg-[#0f1f1e] border border-[#2b3635] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#30b8aa] focus:ring-1 focus:ring-[#30b8aa] transition-all"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
                        <input
                            type="password"
                            className="w-full bg-[#0f1f1e] border border-[#2b3635] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#30b8aa] focus:ring-1 focus:ring-[#30b8aa] transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Referral Code (Optional)</label>
                            <input
                                type="text"
                                className="w-full bg-[#0f1f1e] border border-[#2b3635] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#30b8aa] focus:ring-1 focus:ring-[#30b8aa] transition-all"
                                placeholder="WISE-2024"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#30b8aa] hover:bg-[#28958a] text-[#0f1f1e] font-bold py-3.5 rounded-lg shadow-[0_0_15px_rgba(48,184,170,0.3)] hover:shadow-[0_0_25px_rgba(48,184,170,0.5)] active:scale-[0.98] transition-all duration-200 mt-2"
                    >
                        {isLogin ? 'Log In' : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    By continuing, you agree to our <a href="#" className="text-[#30b8aa] hover:underline">Terms of Service</a>.
                </p>
            </div>
        </div>
    );
};
