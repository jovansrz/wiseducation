import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

interface Thread {
    id: string;
    title: string;
    updatedAt: string;
}

export const AIAssistant: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // State for delete modal
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch threads on mount
    useEffect(() => {
        fetchThreads();
    }, []);

    // Fetch messages when thread changes
    useEffect(() => {
        if (currentThreadId) {
            fetchMessages(currentThreadId);
        } else {
            setMessages([]); // Clear messages for new chat
        }
    }, [currentThreadId]);

    const fetchThreads = async () => {
        try {
            const response = await fetch('http://localhost:3005/api/ai/threads', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setThreads(data);
            }
        } catch (error) {
            console.error("Failed to fetch threads", error);
        }
    };

    const fetchMessages = async (threadId: string) => {
        try {
            const response = await fetch(`http://localhost:3005/api/ai/threads/${threadId}`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages", error);
        }
    };

    const handleNewChat = () => {
        setCurrentThreadId(null);
        setMessages([]);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    const handleSelectThread = (threadId: string) => {
        setCurrentThreadId(threadId);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
    };

    // Open Modal
    const handleDeleteThread = (e: React.MouseEvent, threadId: string) => {
        e.stopPropagation();
        setDeleteId(threadId);
    };

    // Actual Delete Action
    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            await fetch(`http://localhost:3005/api/ai/threads/${deleteId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            setThreads(prev => prev.filter(t => t.id !== deleteId));
            if (currentThreadId === deleteId) {
                handleNewChat();
            }
            setDeleteId(null);
        } catch (error) {
            console.error("Failed to delete thread", error);
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const tempId = Date.now().toString();
        const userMessage: Message = {
            id: tempId,
            role: 'user',
            content: inputValue,
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3005/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    message: userMessage.content,
                    threadId: currentThreadId
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            // If this was a new chat, we expect a threadId back and should update our list
            if (!currentThreadId && data.threadId) {
                setCurrentThreadId(data.threadId);
                fetchThreads(); // Refresh list to show new title
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                createdAt: data.timestamp
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Thinking failed. Please try again.",
                createdAt: new Date().toISOString()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white overflow-hidden h-screen flex">

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-stone-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-scale-up">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-full text-red-500 border border-red-500/20">
                                <span className="material-symbols-outlined text-3xl">delete</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Delete Chat?</h3>
                                <p className="text-text-secondary text-sm">This action cannot be undone. Are you sure you want to delete this conversation?</p>
                            </div>
                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => setDeleteId(null)}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors font-medium text-sm shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`absolute md:relative z-30 w-64 h-full bg-stone-900 border-r border-white/5 flex flex-col transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:opacity-0 md:overflow-hidden'}`}>
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-secondary tracking-wider uppercase">History</h2>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-text-secondary">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-3">
                    <button
                        onClick={handleNewChat}
                        className="w-full flex items-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-colors border border-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add_comment</span>
                        <span className="font-medium text-sm">New Chat</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1 scrollbar-thin scrollbar-thumb-stone-700">
                    {threads.map(thread => (
                        <div
                            key={thread.id}
                            onClick={() => handleSelectThread(thread.id)}
                            className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${currentThreadId === thread.id ? 'bg-white/10 text-white' : 'text-text-secondary hover:bg-white/5 hover:text-gray-200'}`}
                        >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                <span className="material-symbols-outlined text-[16px] shrink-0 opacity-70">chat_bubble_outline</span>
                                <span className="truncate text-sm">{thread.title}</span>
                            </div>
                            <button
                                onClick={(e) => handleDeleteThread(e, thread.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                        </div>
                    ))}

                    {threads.length === 0 && (
                        <div className="text-center py-8 px-4 text-text-secondary text-xs opacity-60">
                            No recent chats
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative min-w-0 h-full bg-[#0f1f1e]">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-background-dark/95 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="text-text-secondary hover:text-white"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                {threads.find(t => t.id === currentThreadId)?.title || 'New Chat'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className={`flex h-1.5 w-1.5 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-500'} animate-pulse`}></span>
                                <span className="text-[11px] font-medium text-text-secondary">{isLoading ? 'Thinking...' : 'Groq 70B • Online'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <NavLink to="/" className="flex items-center justify-center gap-2 px-3 py-1.5 bg-stone-800 hover:bg-red-500/10 hover:text-red-400 text-text-secondary text-xs font-medium rounded-lg transition-all border border-transparent hover:border-red-500/20">
                            <span className="material-symbols-outlined text-[16px]">power_settings_new</span>
                            <span className="hidden sm:inline">Exit</span>
                        </NavLink>
                    </div>
                </header>

                {/* Chat Container */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth" id="chat-container">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                            <div className="bg-white/5 p-4 rounded-full mb-4">
                                <span className="material-symbols-outlined text-4xl text-primary">smart_toy</span>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">How can I help you today?</h3>
                            <p className="text-text-secondary text-sm max-w-xs">Ask about market trends, analysis, or financial concepts.</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                            <div className={`shrink-0 rounded-full size-8 sm:size-10 flex items-center justify-center shadow-sm ${msg.role === 'assistant' ? 'bg-primary/20 text-primary' : 'bg-stone-700'}`}>
                                {msg.role === 'assistant' ? (
                                    <span className="material-symbols-outlined text-sm sm:text-base">smart_toy</span>
                                ) : (
                                    <span className="material-symbols-outlined text-white text-sm sm:text-base">person</span>
                                )}
                            </div>
                            <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                                <span className="text-[10px] text-text-secondary font-medium mx-1 uppercase tracking-wider">
                                    {msg.role === 'assistant' ? 'WISE AI' : 'You'}
                                </span>
                                <div className={`px-4 py-3 sm:px-5 sm:py-3.5 shadow-sm text-sm sm:text-base leading-relaxed max-w-prose whitespace-pre-wrap ${msg.role === 'assistant'
                                    ? 'bg-stone-800 text-gray-100 rounded-2xl rounded-tl-none'
                                    : 'bg-primary text-white rounded-2xl rounded-tr-none'
                                    }`}>
                                    <p>{msg.content}</p>
                                </div>
                                <span className="text-[9px] text-text-secondary opacity-50 px-1">
                                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-start gap-4 max-w-3xl">
                            <div className="shrink-0 rounded-full size-8 sm:size-10 bg-primary/20 flex items-center justify-center text-primary shadow-sm">
                                <span className="material-symbols-outlined animate-spin text-sm sm:text-base">sync</span>
                            </div>
                            <div className="bg-stone-800 text-gray-400 rounded-2xl rounded-tl-none px-5 py-3.5 shadow-sm text-sm italic">
                                Thinking...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-6 bg-background-dark/95 backdrop-blur z-10 w-full max-w-4xl mx-auto">
                    {/* Quick Action Chips */}
                    {messages.length === 0 && (
                        <div className="flex items-center justify-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                            {["📈 Market Analysis", "💡 Investment Tips", "📰 Crypto News", "📊 My Portfolio"].map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => setInputValue(`Tell me about ${chip.split(' ')[1]}...`)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800 border border-white/5 hover:border-primary/50 hover:bg-stone-800/80 text-xs sm:text-sm font-medium text-text-secondary hover:text-white transition-all whitespace-nowrap"
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input Bar */}
                    <div className="relative flex items-end gap-2 bg-stone-800 rounded-xl border border-white/10 p-2 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-lg">
                        <button className="p-2 text-text-secondary hover:text-white rounded-lg hover:bg-white/5 transition-colors shrink-0" title="Attach file">
                            <span className="material-symbols-outlined">add_circle</span>
                        </button>
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full bg-transparent border-none text-white placeholder-text-secondary focus:ring-0 resize-none py-2.5 max-h-32 min-h-[44px]"
                            placeholder="Message WISE AI..."
                            rows={1}
                            style={{ fieldSizing: "content" } as any}
                            disabled={isLoading}
                        ></textarea>
                        <div className="flex gap-1 shrink-0 pb-0.5">
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className={`p-2 rounded-lg shadow-md transition-all flex items-center justify-center ${!inputValue.trim() || isLoading
                                    ? 'bg-stone-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-dark text-white hover:scale-105 active:scale-95'
                                    }`}
                            >
                                <span className="material-symbols-outlined">send</span>
                            </button>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-text-secondary mt-3 opacity-60">Groq Llama 3 - 70B • Content is for educational purposes only.</p>
                </div>
            </main>
        </div>
    );
};
