import React, { useState } from 'react';

interface Question {
    id: string;
    text: string;
    type: string;
    options: Record<string, string>;
}

interface QuizProps {
    quizId: string;
    title: string;
    questions: Question[];
    onComplete: (score: number, passed: boolean) => void;
}

export const QuizComponent: React.FC<QuizProps> = ({ quizId, title, questions, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number; passed: boolean; isPerfect: boolean } | null>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleOptionSelect = (optionKey: string) => {
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionKey }));
    };

    const handleNext = () => {
        if (isLastQuestion) {
            submitQuiz();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const submitQuiz = async () => {
        setIsSubmitting(true);
        try {
            // Ideally use a generic fetch wrapper, but direct fetch for now
            const API_BASE = 'http://localhost:3005/api'; // Hardcoded for now, should use env
            // Assuming we have a way to get token, but for now passing userId as header if needed or relying on cookie
            // Since auth is not fully clear, I'll assume standardized fetch or context.
            // I'll grab the token from localStorage if it exists (common pattern) or assume cookie

            const response = await fetch(`${API_BASE}/education/quiz/${quizId}/attempt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // If needed
                },
                body: JSON.stringify({ answers })
            });

            const data = await response.json();
            setResult({
                score: data.score,
                passed: data.passed,
                isPerfect: data.isPerfect
            });
            onComplete(data.score, data.passed);
        } catch (error) {
            console.error("Failed to submit quiz", error);
            alert("Failed to submit quiz. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        return (
            <div className="bg-card-dark border border-card-border rounded-xl p-8 text-center">
                <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-4 ${result.passed ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    <span className="material-symbols-outlined text-4xl">{result.passed ? 'emoji_events' : 'sentiment_dissatisfied'}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{result.passed ? 'Quiz Passed!' : 'Quiz Failed'}</h3>
                <p className="text-text-secondary mb-6">You scored <span className={`font-bold ${result.passed ? 'text-green-500' : 'text-red-500'}`}>{result.score}%</span></p>

                {result.isPerfect && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                        <p className="text-yellow-500 font-bold flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">star</span>
                            Perfect Score Bonus! +Rp 500.000
                        </p>
                    </div>
                )}

                <button
                    onClick={() => {
                        setResult(null);
                        setCurrentQuestionIndex(0);
                        setAnswers({});
                    }}
                    className="bg-card-border hover:bg-[#364442] text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    Retake Quiz
                </button>
            </div>
        );
    }

    return (
        <div className="bg-card-dark border border-card-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-6 border-b border-card-border pb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-sm text-text-secondary">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
                <div className="h-10 w-10 rounded-full border border-card-border flex items-center justify-center text-sm font-bold text-white">
                    {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </div>
            </div>

            <div className="mb-8">
                <h4 className="text-lg font-medium text-white mb-6">{currentQuestion.text}</h4>
                <div className="space-y-3">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => handleOptionSelect(key)}
                            className={`w-full text-left p-4 rounded-xl border transition-all ${answers[currentQuestion.id] === key
                                    ? 'bg-primary/20 border-primary text-white'
                                    : 'bg-background-dark border-card-border text-text-secondary hover:border-primary/50 hover:text-white'
                                }`}
                        >
                            <span className="font-bold mr-3 uppercase">{key}.</span>
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-card-border">
                <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="text-text-secondary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium px-4 py-2"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={!answers[currentQuestion.id] || isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? 'Submitting...' : isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                    {!isSubmitting && !isLastQuestion && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
            </div>
        </div>
    );
};
