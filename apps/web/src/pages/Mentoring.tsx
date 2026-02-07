import React, { useState, useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { mentoringService, type MentorThread, type MentorMessage } from '../services/mentoring.service';

// Mock Mentor Data with realistic profile images
const MENTORS = [
    {
        id: 'mentor-1',
        name: 'Sarah Chen',
        role: 'Senior Stock Analyst',
        company: 'Goldman Sachs Ex-Analyst',
        expertise: ['Stocks', 'Fundamental Analysis', 'Long-term Growth'],
        price: 500000,
        rating: 4.9,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
        description: "I help beginners understand financial statements and find undervalued stocks for long-term wealth building."
    },
    {
        id: 'mentor-2',
        name: 'Michael Ross',
        role: 'Crypto Swing Trader',
        company: 'Full-time Trader',
        expertise: ['Crypto', 'Technical Analysis', 'Risk Management'],
        price: 750000,
        rating: 4.8,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        description: "Master the charts. I teach technical analysis patterns and strict risk management rules for crypto trading."
    },
    {
        id: 'mentor-3',
        name: 'Jessica Wu',
        role: 'ETF Strategist',
        company: 'Vanguard Certified',
        expertise: ['ETFs', 'Passive Income', 'Retirement Planning'],
        price: 300000,
        rating: 5.0,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
        description: "Set it and forget it. Learn how to build a diversified portfolio that works for you while you sleep."
    },
    {
        id: 'mentor-4',
        name: 'David Miller',
        role: 'Options Trader',
        company: 'Prop Firm Trader',
        expertise: ['Options', 'Hedging', 'Advanced Strategies'],
        price: 1000000,
        rating: 4.7,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        description: "Advanced strategies for experienced traders looking to hedge their portfolio or generate monthly income."
    },
    {
        id: 'mentor-5',
        name: 'Emily Zhang',
        role: 'ESG Investor',
        company: 'Green Capital',
        expertise: ['Sustainable Investing', 'Green Energy', 'Impact'],
        price: 450000,
        rating: 4.9,
        reviews: 78,
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        description: "Invest in the future. Learn how to identify companies that are changing the world for the better."
    },
    {
        id: 'mentor-6',
        name: 'James Wilson',
        role: 'Forex Expert',
        company: 'FX Global',
        expertise: ['Forex', 'Macroeconomics', 'Currency Pairs'],
        price: 600000,
        rating: 4.6,
        reviews: 112,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        description: "Understand global money flows. I teach how macroeconomic events impact currency pairs."
    }
];

// Sort mentors by recommendation score (rating * reviews weight)
const getRecommendationScore = (mentor: typeof MENTORS[0]) => {
    return mentor.rating * Math.log10(mentor.reviews + 1) * 10;
};

const RECOMMENDED_MENTORS = [...MENTORS].sort((a, b) => getRecommendationScore(b) - getRecommendationScore(a));
const TOP_RECOMMENDED = RECOMMENDED_MENTORS.slice(0, 3);

export const Mentoring: React.FC = () => {
    const { virtualCash } = usePortfolio();
    const [activeTab, setActiveTab] = useState<'find' | 'sessions'>('find');
    const [selectedMentor, setSelectedMentor] = useState<typeof MENTORS[0] | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [activeThread, setActiveThread] = useState<MentorThread | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // New Filter State
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const CATEGORIES = ['All', 'Stocks', 'Crypto', 'ETFs', 'Options', 'Forex', 'Sustainable'];

    // State for API data
    const [threads, setThreads] = useState<MentorThread[]>([]);
    const [messages, setMessages] = useState<MentorMessage[]>([]);
    const [threadsLoading, setThreadsLoading] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // Filter mentors logic
    const filteredMentors = MENTORS.filter(mentor => {
        const matchesCategory = selectedCategory === 'All' || mentor.expertise.some(e => e.includes(selectedCategory) || mentor.role.includes(selectedCategory));
        const matchesSearch = mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Fetch threads on mount and when tab changes to sessions
    useEffect(() => {
        if (activeTab === 'sessions') {
            fetchThreads();
        }
    }, [activeTab]);

    // Fetch messages when activeThread changes
    useEffect(() => {
        if (activeThread) {
            fetchMessages(activeThread.id);
            // Set up polling
            const interval = setInterval(() => {
                fetchMessages(activeThread.id);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [activeThread]);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchThreads = async () => {
        setThreadsLoading(true);
        try {
            const data = await mentoringService.getThreads();
            setThreads(data);
        } catch (error) {
            console.error('Failed to fetch threads:', error);
        } finally {
            setThreadsLoading(false);
        }
    };

    const fetchMessages = async (threadId: string) => {
        setMessagesLoading(true);
        try {
            const data = await mentoringService.getMessages(threadId);
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleBookMentor = async () => {
        if (!selectedMentor) return;

        setBookingLoading(true);
        try {
            await mentoringService.bookMentor(selectedMentor.id, selectedMentor.name, selectedMentor.price);
            setBookingSuccess(true);
            // Refresh threads
            await fetchThreads();
            setTimeout(() => {
                setBookingSuccess(false);
                setSelectedMentor(null);
                setActiveTab('sessions');
            }, 2000);
        } catch (error: any) {
            alert(error.message || "Failed to book mentor");
        } finally {
            setBookingLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeThread || !messageInput.trim()) return;

        setSendingMessage(true);
        try {
            await mentoringService.sendMessage(activeThread.id, messageInput);
            setMessageInput('');
            await fetchMessages(activeThread.id);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSendingMessage(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('id-ID').format(value);
    };

    // Check if user already has a thread with this mentor
    const hasActiveSession = (mentorId: string) => {
        return threads.some((t: MentorThread) => t.mentorId === mentorId);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background-dark text-white">
            {/* Header / Hero Section (Only visible on 'find' tab) */}
            {activeTab === 'find' && (
                <div className="shrink-0 p-6 pb-2">
                    <div className="relative rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-primary/20 to-purple-500/20 border border-white/5 p-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="max-w-xl">
                                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                                    Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-200">Financial Guide</span>
                                </h1>
                                <p className="text-text-secondary text-base mb-6">
                                    Book 1-on-1 sessions with vetted experts. Master stocks, crypto, and more with personalized guidance.
                                </p>

                                <div className="relative max-w-md">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-secondary">search</span>
                                    <input
                                        type="text"
                                        placeholder="Search by name, expertise, or role..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all placeholder-text-secondary/50"
                                    />
                                </div>
                            </div>

                            <div className="hidden md:flex gap-3">
                                <div className="text-center p-4 bg-black/20 rounded-xl backdrop-blur-sm border border-white/5">
                                    <p className="text-2xl font-bold font-display text-white">4.9/5</p>
                                    <p className="text-xs text-text-secondary uppercase tracking-wider">Avg Rating</p>
                                </div>
                                <div className="text-center p-4 bg-black/20 rounded-xl backdrop-blur-sm border border-white/5">
                                    <p className="text-2xl font-bold font-display text-primary">120+</p>
                                    <p className="text-xs text-text-secondary uppercase tracking-wider">Experts</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                        ? 'bg-white text-black'
                                        : 'bg-card-dark border border-white/10 text-text-secondary hover:text-white hover:border-white/30'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex bg-card-dark rounded-lg p-1 border border-card-border shrink-0 ml-4">
                            <button
                                onClick={() => setActiveTab('sessions')}
                                className="px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 text-text-secondary hover:text-white"
                            >
                                My Sessions
                                {threads.length > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{threads.length}</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            {activeTab === 'find' ? (
                <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-8 custom-scrollbar">

                    {/* Top Recommended (Horizontal Scroll) */}
                    {selectedCategory === 'All' && !searchQuery && (
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-yellow-400">workspace_premium</span>
                                <h2 className="text-lg font-bold text-white">Top Rated Mentors</h2>
                            </div>
                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 snap-x">
                                {TOP_RECOMMENDED.map((mentor, index) => {
                                    const isBooked = hasActiveSession(mentor.id);
                                    return (
                                        <div
                                            key={mentor.id}
                                            className="snap-center shrink-0 w-[300px] md:w-[350px] relative bg-card-dark border border-white/5 rounded-2xl p-5 flex flex-col hover:border-primary/50 transition-all hover:-translate-y-1 group"
                                        >
                                            {/* Rank Badge */}
                                            <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10 ${index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-600 text-black' :
                                                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                                    'bg-gradient-to-br from-amber-600 to-amber-800 text-white'
                                                }`}>
                                                #{index + 1}
                                            </div>

                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-16 h-16 rounded-full bg-background-dark border-2 border-primary overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                                                    <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-white truncate">{mentor.name}</h3>
                                                    <p className="text-primary text-xs font-medium uppercase tracking-wider truncate">{mentor.role}</p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="material-symbols-outlined text-yellow-400 text-sm">star</span>
                                                        <span className="text-white font-bold text-sm">{mentor.rating}</span>
                                                        <span className="text-text-secondary text-xs">({mentor.reviews})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-text-secondary text-sm mb-4 line-clamp-2 h-10">{mentor.description}</p>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                                <div>
                                                    <p className="text-text-secondary text-[10px] uppercase">Per Session</p>
                                                    <p className="text-white font-bold">Rp {formatCurrency(mentor.price)}</p>
                                                </div>
                                                <button
                                                    onClick={() => isBooked ? setActiveTab('sessions') : setSelectedMentor(mentor)}
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-black/20 ${isBooked ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-primary text-white hover:bg-primary/90 hover:shadow-primary/20'
                                                        }`}
                                                >
                                                    {isBooked ? 'Open Chat' : 'Book'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* All Mentors (Grid / List hybrid) */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-white">
                                {searchQuery ? 'Search Results' : 'Explore Experts'}
                            </h2>
                            <p className="text-sm text-text-secondary">{filteredMentors.length} mentors found</p>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {filteredMentors.map((mentor) => {
                                const isBooked = hasActiveSession(mentor.id);
                                const isTop = TOP_RECOMMENDED.some(r => r.id === mentor.id);
                                return (
                                    <div key={mentor.id} className="bg-card-dark border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:bg-white/[0.02] transition-colors group">
                                        <div className="shrink-0 relative">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-background-dark border border-white/10 overflow-hidden">
                                                <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                                            </div>
                                            {isTop && (
                                                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                                    TOP
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-base font-bold text-white truncate pr-2">{mentor.name}</h3>
                                                    <p className="text-primary text-xs mb-1">{mentor.role}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-bold text-sm">Rp {formatCurrency(mentor.price)}</p>
                                                    <div className="flex items-center justify-end gap-1 text-xs">
                                                        <span className="material-symbols-outlined text-yellow-400 text-[14px]">star</span>
                                                        <span className="text-white">{mentor.rating}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 my-2">
                                                {mentor.expertise.slice(0, 3).map(skill => (
                                                    <span key={skill} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-text-secondary border border-white/5">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {mentor.expertise.length > 3 && (
                                                    <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-text-secondary border border-white/5">
                                                        +{mentor.expertise.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-col justify-center gap-2 border-t sm:border-t-0 sm:border-l border-white/5 pt-3 sm:pt-0 sm:pl-4 mt-2 sm:mt-0">
                                            <button
                                                onClick={() => isBooked ? setActiveTab('sessions') : setSelectedMentor(mentor)}
                                                className={`flex-1 sm:w-24 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${isBooked ? 'bg-white/10 text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                    }`}
                                            >
                                                {isBooked ? 'Chat' : 'Book'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {filteredMentors.length === 0 && (
                                <div className="col-span-1 xl:col-span-2 py-12 text-center border border-dashed border-white/10 rounded-xl">
                                    <span className="material-symbols-outlined text-4xl text-text-secondary mb-2">search_off</span>
                                    <p className="text-text-secondary">No mentors found matching your filters.</p>
                                    <button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }} className="mt-2 text-primary text-sm font-bold hover:underline">
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            ) : (
                <div className="flex flex-1 bg-card-dark overflow-hidden min-h-0 relative z-0">
                    {/* Threads List Sidebar */}
                    <div className={`${activeThread ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-card-border bg-background-dark/50`}>
                        <div className="p-4 border-b border-card-border flex items-center justify-between bg-card-dark">
                            <h3 className="font-bold text-white">Active Sessions</h3>
                            <button
                                onClick={() => setActiveTab('find')}
                                className="text-xs bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white px-2 py-1 rounded transition-colors"
                            >
                                + New
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {threadsLoading ? (
                                <div className="p-4 text-center text-text-secondary">Loading...</div>
                            ) : threads.length === 0 ? (
                                <div className="p-8 text-center">
                                    <span className="material-symbols-outlined text-4xl text-text-secondary mb-2 px-4">forum</span>
                                    <p className="text-text-secondary text-sm">No active sessions.</p>
                                    <button onClick={() => setActiveTab('find')} className="mt-4 text-primary text-sm font-bold hover:underline">Find a Mentor</button>
                                </div>
                            ) : (
                                threads.map((thread: MentorThread) => (
                                    <button
                                        key={thread.id}
                                        onClick={() => setActiveThread(thread)}
                                        className={`w-full text-left p-4 border-b border-card-border hover:bg-white/5 transition-colors flex items-center gap-3 ${activeThread?.id === thread.id ? 'bg-primary/10 border-l-2 border-l-primary' : 'border-l-2 border-l-transparent'}`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                                            {thread.mentorName.charAt(0)}
                                        </div>
                                        <div className="truncate flex-1">
                                            <h4 className={`font-bold text-sm ${activeThread?.id === thread.id ? 'text-primary' : 'text-white'}`}>{thread.mentorName}</h4>
                                            <p className="text-text-secondary text-xs truncate">Click to view chat</p>
                                        </div>
                                        <span className="ml-auto text-[10px] text-text-secondary">
                                            {new Date(thread.updatedAt).toLocaleDateString()}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    {activeThread ? (
                        <div className="flex-1 flex flex-col h-full bg-card-dark relative">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-card-border flex items-center justify-between bg-card-dark z-10">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setActiveThread(null)} className="md:hidden text-text-secondary hover:text-white">
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                            {activeThread.mentorName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{activeThread.mentorName}</h3>
                                            <p className="text-xs text-primary flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                                Online
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-text-secondary hover:text-white">
                                    <span className="material-symbols-outlined">more_vert</span>
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background-dark/30">
                                {messagesLoading && messages.length === 0 ? (
                                    <div className="text-center text-text-secondary py-10">Loading chat history...</div>
                                ) : (
                                    messages.map((msg: MentorMessage) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.sender === 'user'
                                                    ? 'bg-primary text-white rounded-br-none'
                                                    : 'bg-card-border text-white rounded-bl-none'
                                                    }`}
                                            >
                                                <p>{msg.content}</p>
                                                <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-white/70' : 'text-text-secondary'}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-card-border bg-card-dark">
                                <div className="flex gap-2">
                                    <button type="button" className="p-2 text-text-secondary hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">attach_file</span>
                                    </button>
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary/50 placeholder-text-secondary"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!messageInput.trim() || sendingMessage}
                                        className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-primary/20 aspect-square flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="hidden md:flex flex-1 items-center justify-center flex-col text-text-secondary bg-background-dark/20">
                            <div className="w-20 h-20 rounded-full bg-card-border/50 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-text-secondary/50">chat</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Select a Session</h3>
                            <p className="text-sm max-w-xs text-center">Choose an active conversation from the sidebar to continue your mentoring session.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Booking Modal */}
            {selectedMentor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedMentor(null)}></div>
                    <div className="relative w-full max-w-md bg-card-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden scale-in-center">
                        {bookingSuccess ? (
                            <div className="text-center py-12 p-6">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                                    <span className="material-symbols-outlined text-5xl text-green-500">check_rounded</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                                <p className="text-text-secondary mb-6">You can now chat with {selectedMentor.name}.</p>
                                <div className="w-full h-1 bg-card-border rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 animate-progress"></div>
                                </div>
                                <p className="text-xs text-text-secondary mt-2">Redirecting to chat...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between p-6 border-b border-white/5">
                                    <h2 className="text-xl font-bold text-white">Confirm Booking</h2>
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        className="text-text-secondary hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10"
                                    >
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-background-dark rounded-xl border border-white/5">
                                        <img src={selectedMentor.image} alt={selectedMentor.name} className="w-14 h-14 rounded-full border border-white/10" />
                                        <div>
                                            <h3 className="font-bold text-white text-lg">{selectedMentor.name}</h3>
                                            <p className="text-primary text-sm font-medium">{selectedMentor.role}</p>
                                            <div className="flex items-center gap-1 text-xs text-yellow-400 mt-1">
                                                <span className="material-symbols-outlined text-sm">star</span>
                                                {selectedMentor.rating} ({selectedMentor.reviews} reviews)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-secondary">Session Price</span>
                                            <span className="text-white font-bold text-base">Rp {formatCurrency(selectedMentor.price)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-secondary">Your Balance</span>
                                            <span className="text-white font-medium">Rp {formatCurrency(virtualCash)}</span>
                                        </div>
                                        <div className="h-px bg-white/10 my-2"></div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-secondary">Remaining</span>
                                            <span className={`font-bold ${virtualCash >= selectedMentor.price ? "text-primary" : "text-red-500"}`}>
                                                Rp {formatCurrency(virtualCash - selectedMentor.price)}
                                            </span>
                                        </div>
                                    </div>

                                    {virtualCash < selectedMentor.price && (
                                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm">
                                            <span className="material-symbols-outlined text-xl">error_outline</span>
                                            <p>Insufficient virtual cash balance.</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleBookMentor}
                                        disabled={virtualCash < selectedMentor.price || bookingLoading}
                                        className="w-full py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        {bookingLoading ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Confirm Payment
                                                <span className="material-symbols-outlined">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
