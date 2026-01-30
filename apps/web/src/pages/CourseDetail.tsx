import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { QuizComponent } from '../components/QuizComponent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const API_BASE = 'http://localhost:3005/api'; // Should match your request

export const CourseDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<any>(null);
    const [activeLesson, setActiveLesson] = useState<any>(null);
    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            // Fetch Course with Lessons
            const courseRes = await fetch(`${API_BASE}/education/courses/${id}`);
            const courseData = await courseRes.json();

            setCourse(courseData);
            if (courseData.lessons && courseData.lessons.length > 0) {
                setActiveLesson(courseData.lessons[0]);
            }

            // Fetch Quiz
            const quizRes = await fetch(`${API_BASE}/education/courses/${id}/quiz`);
            if (quizRes.ok) {
                const quizData = await quizRes.json();
                setQuiz(quizData);
            }
        } catch (error) {
            console.error("Error fetching course details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to extract YouTube embed URL
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        try {
            // Handle standard youtube.com/watch?v=ID
            if (url.includes('watch?v=')) {
                return url.replace('watch?v=', 'embed/');
            }
            // Handle youtu.be/ID
            if (url.includes('youtu.be/')) {
                const id = url.split('youtu.be/')[1];
                return `https://www.youtube.com/embed/${id}`;
            }
            // Handle strict embed links already
            if (url.includes('youtube.com/embed/')) {
                return url;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    const handleLessonSelect = (lesson: any) => {
        setActiveLesson(lesson);
    };

    const markLessonComplete = async (lessonId: string) => {
        try {
            await fetch(`${API_BASE}/education/lessons/${lessonId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            // Update local state to show completion
            const updatedLessons = course.lessons.map((l: any) =>
                l.id === lessonId ? { ...l, completed: true } : l
            );
            setCourse({ ...course, lessons: updatedLessons });
        } catch (error) {
            console.error("Failed to mark lesson complete", error);
        }
    };

    if (loading) return <div className="text-white p-8">Loading course content...</div>;
    if (!course) return <div className="text-white p-8">Course not found</div>;

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto pr-2">
                {/* Video Player */}
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 relative group">
                    {activeLesson?.type === 'video' ? (
                        activeLesson.videoUrl ? (
                            <iframe
                                className="w-full h-full"
                                src={getEmbedUrl(activeLesson.videoUrl)}
                                title={activeLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full text-text-secondary bg-card-dark">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-4xl text-text-secondary">videocam_off</span>
                                    <span>Video content unavailable</span>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="p-8 h-full bg-card-dark rounded-xl border border-card-border overflow-y-auto">
                            <h1 className="text-3xl font-bold text-white mb-6">{activeLesson?.title}</h1>
                            <div className="prose prose-invert max-w-none text-text-secondary">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {activeLesson?.content || "No text content available."}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lesson Info */}
                <div className="bg-card-dark border border-card-border rounded-xl p-6 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">{activeLesson?.title}</h2>
                            <p className="text-text-secondary">{course.title} • {activeLesson?.durationMinutes} min</p>
                        </div>
                        <button
                            onClick={() => markLessonComplete(activeLesson.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeLesson?.completed
                                ? 'bg-green-500/20 text-green-500 cursor-default'
                                : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                        >
                            {activeLesson?.completed ? (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Completed
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">check</span>
                                    Mark Complete
                                </>
                            )}
                        </button>
                    </div>

                    {/* Simulated Quiz Trigger */}
                    {quiz && (
                        <div className="mt-6 pt-6 border-t border-card-border">
                            <h3 className="text-lg font-bold text-white mb-4">Module Quiz</h3>
                            <QuizComponent
                                quizId={quiz.id}
                                title={quiz.title}
                                questions={quiz.questions}
                                onComplete={() => fetchCourseData()}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar: Lesson List */}
            <div className="w-full lg:w-80 shrink-0 flex flex-col bg-card-dark border border-card-border rounded-xl overflow-hidden h-full">
                <div className="p-4 border-b border-card-border bg-card-dark">
                    <h3 className="font-bold text-white">Course Content</h3>
                    <div className="mt-2 text-xs text-text-secondary flex justify-between">
                        <span>{course.lessons?.filter((l: any) => l.completed).length}/{course.lessons?.length} Completed</span>
                        <span>{Math.round((course.lessons?.filter((l: any) => l.completed).length / course.lessons?.length) * 100)}%</span>
                    </div>
                    <div className="mt-2 h-1 w-full bg-card-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${(course.lessons?.filter((l: any) => l.completed).length / course.lessons?.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {course.lessons?.map((lesson: any, index: number) => (
                        <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full text-left p-4 border-b border-card-border transition-colors hover:bg-card-border/30 flex gap-3 ${activeLesson?.id === lesson.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
                                }`}
                        >
                            <div className="mt-0.5">
                                {lesson.completed ? (
                                    <span className="material-symbols-outlined text-green-500 text-[18px]">check_circle</span>
                                ) : (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-text-secondary text-[10px] text-text-secondary">
                                        {index + 1}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h4 className={`text-sm font-medium ${activeLesson?.id === lesson.id ? 'text-primary' : 'text-white'}`}>
                                    {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                                        {lesson.durationMinutes} min
                                    </span>
                                    <span className="text-xs text-text-secondary flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[12px]">{lesson.type === 'video' ? 'play_circle' : 'article'}</span>
                                        {lesson.type === 'video' ? 'Video' : 'Reading'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
