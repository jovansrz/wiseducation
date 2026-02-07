import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { authClient } from '../lib/auth-client';

interface Author {
    id: string;
    name: string;
    image: string | null;
}

interface Post {
    id: string;
    content: string;
    type: string;
    imageUrl: string | null;
    pollOptions: any;
    tags: string[];
    upvotes: number;
    downvotes: number;
    commentCount: number;
    createdAt: string;
    author: Author;
}

interface Comment {
    id: string;
    content: string;
    parentId: string | null;
    createdAt: string;
    author: Author;
}

export const Community: React.FC = () => {
    const { data: session } = authClient.useSession();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newPostContent, setNewPostContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [selectedPost, setSelectedPost] = useState<(Post & { comments: Comment[] }) | null>(null);
    const [newComment, setNewComment] = useState('');
    const [activeFilter, setActiveFilter] = useState<'trending' | 'new' | 'top'>('trending');

    // Fetch posts on mount
    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get('/community/posts');
            setPosts(res.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!newPostContent.trim() || submitting) return;

        try {
            setSubmitting(true);
            const res = await api.post('/community/posts', {
                content: newPostContent,
                type: 'text'
            });
            // Add new post to the top of the list
            const newPost = res.data[0];
            // Fetch the author info for the new post
            newPost.author = {
                id: session?.user?.id,
                name: session?.user?.name,
                image: session?.user?.image
            };
            setPosts([newPost, ...posts]);
            setNewPostContent('');
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to create post. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleVote = async (postId: string, direction: 1 | -1) => {
        try {
            const res = await api.post(`/community/posts/${postId}/vote`, { direction });
            // Update local state with new vote counts
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, upvotes: res.data.upvotes, downvotes: res.data.downvotes }
                    : p
            ));
        } catch (err) {
            console.error('Error voting:', err);
        }
    };

    const handleViewComments = async (postId: string) => {
        try {
            const res = await api.get(`/community/posts/${postId}`);
            setSelectedPost(res.data);
        } catch (err) {
            console.error('Error fetching post:', err);
        }
    };

    const handleAddComment = async () => {
        if (!selectedPost || !newComment.trim()) return;

        try {
            await api.post(`/community/posts/${selectedPost.id}/comments`, {
                content: newComment
            });
            // Refresh post with comments
            handleViewComments(selectedPost.id);
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        return 'Just now';
    };

    const userAvatar = session?.user?.image || 'https://via.placeholder.com/40';
    const userName = session?.user?.name || 'Anonymous';

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
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-transparent hover:ring-primary transition-all"
                                style={{ backgroundImage: `url('${userAvatar}')` }}
                            ></div>
                            <span className="text-white font-medium hidden sm:block">{userName}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex flex-1 justify-center py-6 px-4 sm:px-6 w-full max-w-[1440px] mx-auto gap-6">
                {/* Left Sidebar (Navigation) */}
                <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-6 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
                    {/* Primary Action */}
                    <button
                        onClick={() => document.getElementById('create-post-input')?.focus()}
                        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-[#238c82] transition-colors text-white gap-2 text-base font-bold leading-normal shadow-lg shadow-primary/20"
                    >
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
                            <button
                                onClick={() => setActiveFilter('trending')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeFilter === 'trending'
                                        ? 'bg-[#2b3635] text-primary border border-primary/30'
                                        : 'hover:bg-[#2b3635] text-[#a1b5b3] hover:text-white'
                                    }`}
                            >
                                Trending
                            </button>
                            <button
                                onClick={() => setActiveFilter('new')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeFilter === 'new'
                                        ? 'bg-[#2b3635] text-primary border border-primary/30'
                                        : 'hover:bg-[#2b3635] text-[#a1b5b3] hover:text-white'
                                    }`}
                            >
                                New
                            </button>
                            <button
                                onClick={() => setActiveFilter('top')}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeFilter === 'top'
                                        ? 'bg-[#2b3635] text-primary border border-primary/30'
                                        : 'hover:bg-[#2b3635] text-[#a1b5b3] hover:text-white'
                                    }`}
                            >
                                Top
                            </button>
                        </div>
                        <button className="text-[#a1b5b3] hover:text-white flex items-center gap-1 text-sm font-medium">
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                            Filter
                        </button>
                    </div>

                    {/* Create Post Input */}
                    <div className="flex gap-4 p-4 rounded-xl bg-surface-dark border border-[#2b3635]">
                        <div
                            className="size-10 rounded-full bg-cover bg-center shrink-0"
                            style={{ backgroundImage: `url('${userAvatar}')` }}
                        ></div>
                        <div className="flex-1">
                            <input
                                id="create-post-input"
                                className="w-full bg-[#2b3635] border-none rounded-lg px-4 py-2.5 text-white placeholder-[#a1b5b3] focus:ring-1 focus:ring-primary mb-3"
                                placeholder="Share your market insights..."
                                type="text"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                            />
                            <div className="flex justify-between items-center">
                                <div className="flex gap-2">
                                    <button className="text-[#a1b5b3] hover:text-primary p-1"><span className="material-symbols-outlined text-[20px]">image</span></button>
                                    <button className="text-[#a1b5b3] hover:text-primary p-1"><span className="material-symbols-outlined text-[20px]">bar_chart</span></button>
                                    <button className="text-[#a1b5b3] hover:text-primary p-1"><span className="material-symbols-outlined text-[20px]">poll</span></button>
                                </div>
                                <button
                                    onClick={handleCreatePost}
                                    disabled={!newPostContent.trim() || submitting}
                                    className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-center">
                            {error}
                            <button onClick={fetchPosts} className="ml-2 underline hover:no-underline">Retry</button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && posts.length === 0 && (
                        <div className="text-center py-12 text-[#a1b5b3]">
                            <span className="material-symbols-outlined text-[48px] mb-4 block">forum</span>
                            <p className="text-lg font-medium">No posts yet</p>
                            <p className="text-sm">Be the first to start a discussion!</p>
                        </div>
                    )}

                    {/* Posts Feed */}
                    {!loading && !error && posts.map((post) => (
                        <article key={post.id} className="flex flex-col gap-4 p-5 rounded-xl bg-surface-dark border border-[#2b3635] hover:border-primary/20 transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div
                                        className="size-10 rounded-full bg-cover bg-center bg-[#2b3635]"
                                        style={{ backgroundImage: post.author.image ? `url('${post.author.image}')` : undefined }}
                                    ></div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-bold text-sm">{post.author.name}</span>
                                            <span className="text-[#a1b5b3] text-xs">• {formatTimeAgo(post.createdAt)}</span>
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <span className="text-[#a1b5b3] text-xs font-medium">in #{post.tags[0]}</span>
                                        )}
                                    </div>
                                </div>
                                <button className="text-[#a1b5b3] hover:text-white">
                                    <span className="material-symbols-outlined">more_horiz</span>
                                </button>
                            </div>
                            <div>
                                <p className="text-[#d1dcdb] text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                                {post.imageUrl && (
                                    <div className="w-full h-64 rounded-lg bg-[#2b3635] relative overflow-hidden mt-4">
                                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center justify-between border-t border-[#2b3635] pt-3 mt-1">
                                <div className="flex gap-4">
                                    <div className="flex items-center bg-[#2b3635] rounded-lg p-1">
                                        <button
                                            onClick={() => handleVote(post.id, 1)}
                                            className="p-1 hover:text-primary text-[#a1b5b3] transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                                        </button>
                                        <span className="px-2 text-sm font-bold text-white">{post.upvotes - post.downvotes}</span>
                                        <button
                                            onClick={() => handleVote(post.id, -1)}
                                            className="p-1 hover:text-red-400 text-[#a1b5b3] transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">arrow_downward</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleViewComments(post.id)}
                                        className="flex items-center gap-1.5 text-[#a1b5b3] hover:text-white transition-colors text-sm font-medium"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                                        {post.commentCount} Comments
                                    </button>
                                    <button className="flex items-center gap-1.5 text-[#a1b5b3] hover:text-white transition-colors text-sm font-medium">
                                        <span className="material-symbols-outlined text-[20px]">share</span>
                                        Share
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
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
                            <p className="text-[#a1b5b3] text-sm">Join the community and start contributing!</p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Comment Modal */}
            {selectedPost && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-surface-dark rounded-xl border border-[#2b3635] w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-[#2b3635]">
                            <h3 className="text-white font-bold">Comments</h3>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="text-[#a1b5b3] hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedPost.comments.length === 0 ? (
                                <p className="text-[#a1b5b3] text-center py-8">No comments yet. Be the first!</p>
                            ) : (
                                selectedPost.comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3">
                                        <div
                                            className="size-8 rounded-full bg-cover bg-center bg-[#2b3635] shrink-0"
                                            style={{ backgroundImage: comment.author.image ? `url('${comment.author.image}')` : undefined }}
                                        ></div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-bold text-sm">{comment.author.name}</span>
                                                <span className="text-[#a1b5b3] text-xs">{formatTimeAgo(comment.createdAt)}</span>
                                            </div>
                                            <p className="text-[#d1dcdb] text-sm mt-1">{comment.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="p-4 border-t border-[#2b3635]">
                            <div className="flex gap-3">
                                <div
                                    className="size-8 rounded-full bg-cover bg-center shrink-0"
                                    style={{ backgroundImage: `url('${userAvatar}')` }}
                                ></div>
                                <input
                                    className="flex-1 bg-[#2b3635] border-none rounded-lg px-4 py-2 text-white placeholder-[#a1b5b3] focus:ring-1 focus:ring-primary"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={!newComment.trim()}
                                    className="bg-primary hover:bg-[#238c82] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Mobile Action Button */}
            <div className="fixed bottom-6 right-6 lg:hidden">
                <button
                    onClick={() => document.getElementById('create-post-input')?.focus()}
                    className="size-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center"
                >
                    <span className="material-symbols-outlined text-[28px]">add</span>
                </button>
            </div>
        </div>
    );
};
