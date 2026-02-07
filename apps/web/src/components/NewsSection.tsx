import React, { useEffect, useState, useRef } from 'react';
import { api } from '../lib/api';

interface Article {
    source: {
        id: string | null;
        name: string;
    };
    author: string | null;
    title: string;
    description: string;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string;
}

export const NewsSection: React.FC = () => {
    const [news, setNews] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await api.get('/news');
                if (response.data.status === 'ok') {
                    // Filter out articles without images or broken content if needed
                    const validArticles = response.data.articles.filter((article: Article) =>
                        article.urlToImage && article.title && article.description
                    ).slice(0, 12); // Show top 12 news
                    setNews(validArticles);
                }
            } catch (err) {
                console.error('Failed to fetch news:', err);
                setError('Failed to load news');
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = container.clientWidth;
            const targetScroll = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <section className="animate-pulse">
                <div className="flex justify-between items-center mb-4">
                    <div className="h-6 w-32 bg-card-border rounded"></div>
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-card-border rounded-lg"></div>
                        <div className="h-8 w-8 bg-card-border rounded-lg"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-64 bg-card-dark rounded-xl border border-card-border"></div>
                    ))}
                </div>
            </section>
        );
    }

    if (error || news.length === 0) return null;

    return (
        <section>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-white">Market News</h3>
                    <span className="text-xs text-text-secondary">Powered by NewsAPI</span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-card-border bg-card-dark text-text-secondary hover:text-white hover:border-primary/50 transition-colors"
                        aria-label="Previous news"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-card-border bg-card-dark text-text-secondary hover:text-white hover:border-primary/50 transition-colors"
                        aria-label="Next news"
                    >
                        <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {news.map((article, index) => (
                    <a
                        key={index}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="snap-start shrink-0 w-full sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] group flex flex-col rounded-xl border border-card-border bg-card-dark overflow-hidden hover:border-primary/50 transition-all h-[320px]"
                    >
                        <div className="h-32 w-full overflow-hidden relative shrink-0">
                            <img
                                src={article.urlToImage || ''}
                                alt={article.title}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/FFF?text=News';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <span className="absolute bottom-2 left-2 text-xs font-bold text-white bg-primary/80 px-2 py-0.5 rounded">
                                {article.source.name}
                            </span>
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                            <h4 className="font-bold text-white text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                {article.title}
                            </h4>
                            <p className="text-xs text-text-secondary line-clamp-3 mb-3 flex-1 text-ellipsis overflow-hidden">
                                {article.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-text-secondary mt-auto pt-2 border-t border-card-border/50">
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Read more <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};
