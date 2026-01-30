import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Course {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    coverImageUrl?: string;
    thumbnailUrl?: string;
    progress?: number;
    completed?: boolean;
    totalDurationMinutes?: number;
}

const API_BASE = 'http://localhost:3005/api';

export const Education: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses();
    }, [filter]);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            // Use standard endpoint for now. If we had auth token context easily accessible we'd add header
            // Assuming the browser handles session cookies or we pass userId some other way?
            // Education routes with progress require auth.
            // Let's try to hit the public one first if auth is complex, OR assume we are logged in.
            // App.tsx says we are authenticated if we reach here.

            // Note: In a real app we need to pass the token. 
            // For this specific setup, I'll fallback to the public endpoint if I can't easily get the auth headers here without a context update.
            // But wait, PortfolioContext uses simple fetch. Let's try to assume session cookie or similar mechanism works, 
            // OR use the public endpoint `/api/education/courses` which doesn't require auth but won't show progress.
            // To show progress we need `/api/education/courses/with-progress`.

            let url = `${API_BASE}/education/courses${filter ? `?difficulty=${filter}` : ''}`;
            // If we want progress, we need to handle auth. 
            // Since I haven't seen global auth header setup, I'll stick to public data for listing to ensure it works first.
            // User can see progress inside the details or we implement auth headers later.
            // ACTUALLY, I can try to fetch `with-progress` and see if it fails.

            const response = await fetch(url);
            const data = await response.json();

            if (Array.isArray(data)) {
                setCourses(data);
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2 text-white">Learning Modules</h2>
                    <p className="text-text-secondary text-base md:text-lg">Welcome back, Investor! Continue your financial journey.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center justify-center gap-2 h-10 px-4 bg-card-dark border border-card-border rounded-lg text-sm font-bold text-white hover:bg-card-border transition-colors">
                        <span className="material-symbols-outlined text-[20px]">history</span>
                        <span>History</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 h-10 px-4 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">leaderboard</span>
                        <span>Leaderboard</span>
                    </button>
                </div>
            </div>

            {/* Toolbar & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 bg-card-dark p-4 rounded-xl border border-card-border">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary text-[20px]">search</span>
                    <input
                        className="w-full bg-background-dark border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary placeholder-text-secondary text-white outline-none"
                        placeholder="Search modules..."
                        type="text"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                    <button
                        onClick={() => setFilter(null)}
                        className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${!filter ? 'bg-primary text-white' : 'bg-card-border hover:bg-[#364442] text-white'}`}
                    >
                        <span className="material-symbols-outlined filled-icon text-[18px]">grid_view</span>
                        All Levels
                    </button>
                    <button
                        onClick={() => setFilter('Beginner')}
                        className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${filter === 'Beginner' ? 'bg-primary text-white' : 'bg-card-border hover:bg-[#364442] text-white'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">emoji_objects</span>
                        Beginner
                    </button>
                    <button
                        onClick={() => setFilter('Intermediate')}
                        className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${filter === 'Intermediate' ? 'bg-primary text-white' : 'bg-card-border hover:bg-[#364442] text-white'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">trending_up</span>
                        Intermediate
                    </button>
                    <button
                        onClick={() => setFilter('Advanced')}
                        className={`flex h-10 shrink-0 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${filter === 'Advanced' ? 'bg-primary text-white' : 'bg-card-border hover:bg-[#364442] text-white'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">school</span>
                        Advanced
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="text-white text-center py-12">Loading modules...</div>
            ) : courses.length === 0 ? (
                <div className="text-text-secondary text-center py-12">
                    <span className="material-symbols-outlined text-6xl mb-4">school</span>
                    <p>No modules found. Check back later!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <Link
                            to={`/education/${course.id}`}
                            key={course.id}
                            className="group flex flex-col bg-card-dark rounded-xl overflow-hidden border border-card-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url('${course.coverImageUrl || course.thumbnailUrl || 'https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2664&auto=format&fit=crop'}')` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent opacity-80"></div>
                                <div className={`absolute top-3 left-3 bg-card-border/90 backdrop-blur-sm px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${course.difficulty === 'Beginner' ? 'text-green-400' :
                                        course.difficulty === 'Intermediate' ? 'text-yellow-400' :
                                            'text-red-400'
                                    }`}>
                                    <span className="material-symbols-outlined text-[14px]">
                                        {course.difficulty === 'Beginner' ? 'emoji_objects' :
                                            course.difficulty === 'Intermediate' ? 'trending_up' :
                                                'school'}
                                    </span>
                                    {course.difficulty}
                                </div>
                                {course.completed && (
                                    <div className="absolute top-3 right-3 bg-primary text-white rounded-full p-1 shadow-lg">
                                        <span className="material-symbols-outlined block text-[16px]">check</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 p-5">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors line-clamp-1">{course.title}</h3>
                                    <p className="text-text-secondary text-sm line-clamp-2">{course.description}</p>
                                </div>
                                <div className="mt-auto space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs font-medium text-text-secondary">
                                            <span>Duration</span>
                                            <span className="text-white">{course.totalDurationMinutes || 0} min</span>
                                        </div>
                                        {/* Progress bar placeholder - fully integrated when using authenticated endpoint */}
                                        <div className="h-1.5 w-full bg-card-border rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${course.progress || 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 bg-card-border group-hover:bg-primary text-white font-bold py-2.5 px-4 rounded-lg transition-colors text-sm border border-transparent">
                                        <span>Start Learning</span>
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination / Load More */}
            <div className="mt-12 flex justify-center">
                <button className="flex items-center gap-2 text-sm font-bold text-text-secondary hover:text-white transition-colors bg-card-dark border border-card-border px-6 py-3 rounded-lg hover:bg-card-border">
                    <span>Load More Modules</span>
                    <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </button>
            </div>
        </>
    );
};
