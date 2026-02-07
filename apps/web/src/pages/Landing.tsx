import React, { useState, useEffect, useRef } from 'react';

interface LandingProps {
    onOpenAuth: () => void;
}

const MOTTOS = [
    "Be A Smart Investor",
    "From Learning to Earning",
    "Master the Markets",
    "Level Up Your Portfolio"
];

interface Particle {
    id: number;
    x: number;
    y: number;
}

export const Landing: React.FC<LandingProps> = ({ onOpenAuth }) => {
    const [mottoIndex, setMottoIndex] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showSpeech, setShowSpeech] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    // Mini-Game State
    const [xp, setXp] = useState(0);
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMottoIndex((current) => (current + 1) % MOTTOS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setMousePos({ x: x * 30, y: y * 30 }); // Max 30px movement
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleMascotClick = (e: React.MouseEvent<HTMLDivElement>) => {
        setXp(prev => prev + 10);

        // Add particle
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newParticle = { id: Date.now(), x, y };

        setParticles(prev => [...prev, newParticle]);

        // Remove particle after animation
        setTimeout(() => {
            setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1000);
    };

    return (
        <div className="bg-[#f0fdfa] dark:bg-[#0f1f1e] text-slate-900 dark:text-white font-poppins overflow-x-hidden selection:bg-[#30b8aa] selection:text-[#0f1f1e]">
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1f1e]/80 backdrop-blur-md border-b border-[#30b8aa]/10">
                <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 text-white group cursor-pointer">
                        <img src="/wise-logo.png" alt="WISE Logo" className="h-8 w-auto object-contain transition-transform group-hover:scale-110" />
                        <h2 className="text-xl font-bold tracking-tight">WISE</h2>
                    </div>

                    <div className="hidden md:flex flex-1 justify-center">
                        <div className="relative h-8 overflow-hidden w-64 text-center">
                            {MOTTOS.map((motto, index) => (
                                <span
                                    key={index}
                                    className={`absolute inset-0 flex items-center justify-center text-sm font-bold tracking-wide text-[#30b8aa] transition-all duration-500 transform ${index === mottoIndex
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-8'
                                        }`}
                                >
                                    {motto}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {xp > 0 && (
                            <div className="hidden md:flex items-center gap-1 text-[#30b8aa] font-bold animate-pulse">
                                <span className="material-symbols-outlined text-lg">bolt</span>
                                <span>{xp} XP</span>
                            </div>
                        )}
                        <button onClick={onOpenAuth} className="hidden md:flex text-sm font-bold text-white hover:text-[#30b8aa] transition-colors">Log In</button>
                        <button onClick={onOpenAuth} className="flex items-center justify-center overflow-hidden rounded h-10 px-5 bg-[#30b8aa] text-[#0f1f1e] text-sm font-bold shadow-[0_0_15px_rgba(48,184,170,0.3)] hover:shadow-[0_0_25px_rgba(48,184,170,0.5)] hover:-translate-y-0.5 transition-all duration-300">
                            <span className="truncate">Get Started</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="relative flex flex-col w-full min-h-screen pt-20">
                {/* HERO SECTION */}
                <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-20 bg-[linear-gradient(135deg,_rgba(15,31,30,1)_0%,_rgba(48,184,170,0.15)_50%,_rgba(15,31,30,1)_100%)]">
                    <div className="absolute top-1/4 left-10 w-64 h-64 bg-[#30b8aa]/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-[#30b8aa]/5 rounded-full blur-[120px] pointer-events-none"></div>

                    <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="flex flex-col gap-8 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 rounded-full border border-[#30b8aa]/30 bg-[#30b8aa]/10 text-[#30b8aa] text-xs font-bold uppercase tracking-wider mb-2 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-[#30b8aa]"></span>
                                Beta Access Live
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                                Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#30b8aa] to-teal-200">Portfolio.</span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Join the next generation of investors on a platform built for you. Learn strategies, earn XP, and master the markets with zero risk.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-4">
                                <button onClick={onOpenAuth} className="flex items-center justify-center h-14 px-8 rounded-lg bg-[#30b8aa] text-[#0f1f1e] text-base font-bold shadow-lg shadow-[#30b8aa]/25 hover:shadow-[#30b8aa]/40 hover:-translate-y-1 transition-all duration-300">
                                    Start Journey 🚀
                                </button>
                                <button className="flex items-center justify-center h-14 px-8 rounded-lg border border-gray-700 bg-[#162e2b]/50 text-white text-base font-bold hover:bg-[#162e2b] hover:border-[#30b8aa]/50 transition-all duration-300 backdrop-blur-sm">
                                    View Demo
                                </button>
                            </div>

                            {/* Social Proof */}
                            <div className="flex items-center justify-center lg:justify-start gap-4 mt-6 pt-6 border-t border-gray-800">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full border-2 border-[#0f1f1e] bg-gray-600 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCqR_7u3XK_TND0Pjk-WlsWbJzZWLRfLE_1JBEYVFUxut2eDS3hqB8jwzQ1awblmQlfFo0T3cN-Z8tqCgnBDiAcVPcNFDMgiiSQdazwka3_-13H75YjlD9DrdeEyJ8p6r2DzFkGaNod0JINiULSbxnjZY973BbDxeF8cph8LtZhirV4UpDt6kFc_nMUKJRGhoipxRF6pkePqQ2hlkEobtYKlMk-cZS38CpIscV1pSgUOc4ydZthJToOXOCzZsl5lubWhNQbZjIzWWg')" }}></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-[#0f1f1e] bg-gray-600 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7pQnKIqPOXOgP46qbEhGoaDJThIGXkzd0XvvE2YdjiWYugPT_rl2zyfDasQOublukqo0yaJfuni07F-xOLqHex-wOSiNNSZTVL1hzJCYfVd4dygS4QQAspJ71Fq3cm4BBJev7np5i0ccef0kH593Mtu9AdCU2jb7N9K4f6c_P7J3cowbjDU3Im3P3ltd_sovQEi753R_R9I-Qd8lC_w5QtutF2C0P84ywGgyr9rSbjpsRwalUhqY7CTJt0PWpgRYgK-F3SGbCLj4')" }}></div>
                                    <div className="w-8 h-8 rounded-full border-2 border-[#0f1f1e] bg-gray-600 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBFYEur-cR4KXHdYBS2x_HBO_eb7cmM2J-_ueeGQo1LcjSnYoFHi6OIrb9tUCC-Fzn6dpLeC2PcOEZVBBUXK5aVlIdc3ZDlSwAdnoBpOGZ-Fb-eQDbJ2QvQcVKe7IJVWyExfh0RjpqYtNybcYWZDnrvuYXLbCrCQRXMhOFcvwGec7X2mpuQRPR0N5LYdozVpuBb6mP-zaqAJv49bccu3mxnuynrgQPLbtPpUrwEhomHcHD9gaRQ_gdz0eJnNQix5vL-5efD0cGUqt8')" }}></div>
                                </div>
                                <p className="text-sm text-gray-400"><span className="text-white font-bold">12,000+</span> investors joined this week</p>
                            </div>
                        </div>

                        {/* Interactive Mascot Section */}
                        <div className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center">
                            <div
                                className="relative z-10 w-full max-w-md transition-transform duration-100 ease-out cursor-pointer active:scale-95"
                                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
                                onMouseEnter={() => setShowSpeech(true)}
                                onMouseLeave={() => setShowSpeech(false)}
                                onClick={handleMascotClick}
                            >
                                {/* Speech Bubble */}
                                <div
                                    className={`absolute -top-16 -right-4 bg-white text-[#0f1f1e] px-4 py-2 rounded-xl rounded-bl-none shadow-xl transform transition-all duration-300 md:block hidden ${showSpeech ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
                                        }`}
                                >
                                    <p className="font-bold text-sm">Tap me for XP! 🦉💰</p>
                                </div>

                                {/* Mascot Image */}
                                <img
                                    src="/mascot-sitting.png"
                                    alt="WISE Owl Mascot"
                                    className="w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(48,184,170,0.3)]"
                                />

                                {/* XP Particles */}
                                {particles.map(p => (
                                    <div
                                        key={p.id}
                                        className="absolute pointer-events-none text-[#30b8aa] font-black text-xl animate-[floatUp_0.8s_ease-out_forwards]"
                                        style={{ left: p.x, top: p.y }}
                                    >
                                        +10 XP
                                    </div>
                                ))}
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl animate-bounce z-20" style={{ animationDuration: '3s' }}>
                                <span className="material-symbols-outlined text-[#30b8aa] text-4xl">rocket_launch</span>
                            </div>
                            <div className="absolute bottom-20 left-10 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl animate-bounce z-20" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                <span className="material-symbols-outlined text-yellow-400 text-4xl">emoji_events</span>
                            </div>
                            <div className="absolute top-1/2 -right-8 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-xl animate-pulse z-20 hidden lg:block">
                                <span className="material-symbols-outlined text-purple-400 text-3xl">psychology</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Marquee Section */}
                <div className="w-full bg-[#091415] border-y border-white/5 overflow-hidden py-4">
                    <div className="flex gap-12 animate-marquee whitespace-nowrap min-w-full justify-center md:justify-start px-6">
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm font-medium">BTC/USD</span>
                            <span className="text-white font-bold">$45,230</span>
                            <span className="text-[#30b8aa] text-xs font-bold px-1.5 py-0.5 bg-[#30b8aa]/10 rounded">+5.2%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm font-medium">ETH/USD</span>
                            <span className="text-white font-bold">$3,120</span>
                            <span className="text-[#30b8aa] text-xs font-bold px-1.5 py-0.5 bg-[#30b8aa]/10 rounded">+1.8%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm font-medium">SOL/USD</span>
                            <span className="text-white font-bold">$104.50</span>
                            <span className="text-[#30b8aa] text-xs font-bold px-1.5 py-0.5 bg-[#30b8aa]/10 rounded">+3.2%</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-gray-400 text-sm font-medium">Investors Online</span>
                            <span className="text-white font-bold">14,203</span>
                            <span className="w-2 h-2 rounded-full bg-[#30b8aa] animate-pulse"></span>
                        </div>
                    </div>
                </div>

                {/* HOW IT WORKS SECTION (With Standing Mascot) */}
                <section className="py-24 px-6 bg-gradient-to-b from-[#0f1f1e] to-[#091516]">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">How It Works</h2>
                            <p className="text-gray-400">Go from novice to pro with your personal guide.</p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Standing Mascot - Guide */}
                            <div className="relative order-2 lg:order-1 flex justify-center">
                                <div className="absolute inset-0 bg-[#30b8aa]/20 blur-[80px] rounded-full pointer-events-none"></div>
                                <img
                                    src="/mascot-standing.png"
                                    alt="WISE Mascot Guide"
                                    className="relative w-full max-w-sm drop-shadow-2xl animate-[float_4s_ease-in-out_infinite]"
                                />
                                {/* Dialogue Bubble for Standing Mascot */}
                                <div className="absolute top-10 right-0 bg-white text-[#0f1f1e] px-4 py-2 rounded-xl rounded-bl-none shadow-lg animate-bounce hidden md:block">
                                    <p className="font-bold text-sm">Follow these steps! 👉</p>
                                </div>
                            </div>

                            {/* Steps */}
                            <div className="space-y-8 order-1 lg:order-2">
                                {/* Step 1 */}
                                <div className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#162e2b] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#30b8aa] transition-colors">
                                        <span className="material-symbols-outlined text-white text-3xl group-hover:text-[#30b8aa]">face_6</span>
                                    </div>
                                    <div>
                                        <div className="text-[#30b8aa] text-xs font-bold mb-1 uppercase tracking-wider">Step 1</div>
                                        <h3 className="text-xl font-bold text-white mb-1">Create Avatar</h3>
                                        <p className="text-gray-400 text-sm">Customize your digital identity and set up your investor profile.</p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#162e2b] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#30b8aa] transition-colors">
                                        <span className="material-symbols-outlined text-white text-3xl group-hover:text-[#30b8aa]">checklist</span>
                                    </div>
                                    <div>
                                        <div className="text-[#30b8aa] text-xs font-bold mb-1 uppercase tracking-wider">Step 2</div>
                                        <h3 className="text-xl font-bold text-white mb-1">Complete Missions</h3>
                                        <p className="text-gray-400 text-sm">Take on daily challenges to earn XP and virtual capital.</p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="flex items-center gap-6 group p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
                                    <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#162e2b] border border-white/10 flex items-center justify-center shadow-lg group-hover:border-[#30b8aa] transition-colors">
                                        <span className="material-symbols-outlined text-white text-3xl group-hover:text-[#30b8aa]">monitoring</span>
                                    </div>
                                    <div>
                                        <div className="text-[#30b8aa] text-xs font-bold mb-1 uppercase tracking-wider">Step 3</div>
                                        <h3 className="text-xl font-bold text-white mb-1">Real World Profit</h3>
                                        <p className="text-gray-400 text-sm">Apply your skills to the real market and watch your portfolio grow.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-24 px-6 relative overflow-hidden" id="features">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-12 items-start justify-between mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-[#30b8aa] text-sm font-bold uppercase tracking-widest mb-3">Core Features</h2>
                                <h3 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                                    Gamified tools for the <br className="hidden md:block" /> modern investor.
                                </h3>
                                <p className="text-gray-400 text-lg">Experience a new way to invest. We've replaced boring spreadsheets with interactive quests and real-time leaderboards.</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Feature 1 */}
                            <div className="group p-8 rounded-2xl bg-[#162e2b] border border-white/5 hover:border-[#30b8aa] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#30b8aa]/5 rounded-full blur-2xl group-hover:bg-[#30b8aa]/10 transition-colors"></div>
                                <div className="w-14 h-14 rounded-xl bg-[#132624] border border-[#30b8aa]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[#30b8aa] text-3xl">trophy</span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">Gamified Learning</h4>
                                <p className="text-gray-400 leading-relaxed">Earn badges, unlock achievements, and level up while mastering economic concepts.</p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group p-8 rounded-2xl bg-[#162e2b] border border-white/5 hover:border-[#30b8aa] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#30b8aa]/5 rounded-full blur-2xl group-hover:bg-[#30b8aa]/10 transition-colors"></div>
                                <div className="w-14 h-14 rounded-xl bg-[#132624] border border-[#30b8aa]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[#30b8aa] text-3xl">stadia_controller</span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">Risk-Free Simulator</h4>
                                <p className="text-gray-400 leading-relaxed">Practice your moves with $10k WISE CASH in a live market environment.</p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group p-8 rounded-2xl bg-[#162e2b] border border-white/5 hover:border-[#30b8aa] transition-all duration-300 hover:-translate-y-2 relative overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#30b8aa]/5 rounded-full blur-2xl group-hover:bg-[#30b8aa]/10 transition-colors"></div>
                                <div className="w-14 h-14 rounded-xl bg-[#132624] border border-[#30b8aa]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <span className="material-symbols-outlined text-[#30b8aa] text-3xl">groups</span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-3">Social Investing</h4>
                                <p className="text-gray-400 leading-relaxed">Follow top players on the global leaderboard. Copy their portfolios and learn.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto relative">
                        {/* Flying Mascot Flying In */}
                        <div className="absolute -top-32 -right-12 z-0 hidden md:block animate-[bounce_4s_infinite]">
                            <img src="/mascot-flying.png" alt="Flying Mascot" className="w-48 h-auto opacity-80 hover:opacity-100 transition-opacity" style={{ transform: 'rotate(-15deg)' }} />
                        </div>

                        <div className="rounded-3xl p-8 md:p-16 text-center relative overflow-hidden border border-[#30b8aa]/30 bg-[#162e2b]/40 backdrop-blur-md shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#30b8aa]/5 to-transparent pointer-events-none"></div>
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 relative z-10">Ready to master the markets?</h2>
                            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto relative z-10">Join 50,000+ other Gen Z investors who are changing the game. It's time to invest smarter.</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                                <button onClick={onOpenAuth} className="flex items-center justify-center h-14 px-8 rounded-xl bg-[#30b8aa] text-[#0f1f1e] text-lg font-bold shadow-[0_0_20px_rgba(48,184,170,0.4)] hover:shadow-[0_0_30px_rgba(48,184,170,0.6)] hover:scale-105 transition-all duration-300">
                                    Start Journey Now
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 bg-[#0b191a] pt-16 pb-8 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 text-white mb-6">
                                <img src="/wise-logo.png" alt="WISE Logo" className="h-6 w-auto" />
                                <span className="font-bold text-lg">WISE</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed">The #1 gamified investment platform for the next generation of investors.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Platform</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Features</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Live Markets</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Simulator</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Pricing</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Resources</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Academy</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Blog</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Community Hub</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Help Center</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Legal</h4>
                            <ul className="space-y-3 text-sm text-gray-400">
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Privacy Policy</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Terms of Service</a></li>
                                <li><a className="hover:text-[#30b8aa] transition-colors" href="#">Risk Disclosure</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-600 text-xs">© 2024 WISE Investment. All rights reserved.</p>
                        <div className="flex gap-4">
                            <a className="text-gray-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
                            <a className="text-gray-500 hover:text-white transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
