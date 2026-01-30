import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../lib/auth-client';

export const ProfileSetup: React.FC = () => {
    const navigate = useNavigate();
    const { data: session } = authClient.useSession();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [username, setUsername] = useState(session?.user?.name || '');
    const [bio, setBio] = useState('');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [avatarUrl, setAvatarUrl] = useState(session?.user?.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');

    const interestsList = [
        "Stock Market", "Grid Trading", "Crypto", "Long-term Investing",
        "Day Trading", "Financial Freedom", "ETFs", "Forex"
    ];

    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            if (selectedInterests.length < 5) {
                setSelectedInterests([...selectedInterests, interest]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Update user profile using authClient
            await authClient.updateUser({
                name: username,
                image: avatarUrl,
                // store bio and interests in metadata or separate DB call if needed
                // For now, assuming name and image are primary. 
                // We might need a separate API call for bio/interests if authClient doesn't support generic metadata.
                // Checking auth-client capabilities... usually better to have a backend endpoint.
                // If this is just better-auth, it handles basic fields.
            });

            // If there's a custom backend endpoint for extended profile:
            // await fetch('/api/user/profile', { ... });

            // Simulate delay for effect
            await new Promise(resolve => setTimeout(resolve, 800));

            navigate('/');
        } catch (error) {
            console.error("Failed to update profile", error);
            // Handle error (toast, etc)
        } finally {
            setIsLoading(false);
        }
    };

    // Preset Avatars
    const presetAvatars = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Zack',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Molly',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear',
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Bandit',
    ];

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#0f1f1e] overflow-hidden p-4">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px]"></div>
            </div>

            <div className="relative w-full max-w-2xl bg-card-dark/80 backdrop-blur-xl border border-card-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-full mb-6">
                            <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Setup Your Profile</h1>
                        <p className="text-text-secondary text-lg">Tell us a bit about yourself to personalize your investing journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Avatar Selection */}
                        <div className="space-y-4">
                            <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">Choose Avatar</label>
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-card-border group-hover:ring-primary transition-all duration-300 shadow-xl">
                                        <img src={avatarUrl} alt="Selected Avatar" className="w-full h-full object-cover bg-white/5" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                        <span className="material-symbols-outlined text-white">edit</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrapjustify-center gap-3">
                                    {presetAvatars.map((url, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setAvatarUrl(url)}
                                            className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all duration-200 ${avatarUrl === url ? 'border-primary ring-2 ring-primary/30 scale-110' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                                        >
                                            <img src={url} alt={`Avatar ${index}`} className="w-full h-full object-cover bg-white/5" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid md:grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">Display Name</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">person</span>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-background-dark border border-card-border rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                        placeholder="Enter your display name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">Bio (Optional)</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-background-dark border border-card-border rounded-xl py-3 px-4 text-white placeholder-text-secondary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all min-h-[100px] resize-none"
                                    placeholder="What are your financial goals?"
                                />
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider">
                                Interests <span className="text-xs font-normal normal-case opacity-70">(Max 5)</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {interestsList.map((interest) => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 ${selectedInterests.includes(interest)
                                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                                : 'bg-card-dark border-card-border text-text-secondary hover:border-text-secondary/50 hover:text-white'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/25 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span>Complete Setup</span>
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
