export const aiService = {
    async chat(userId: string, message: string, context?: string) {
        // Placeholder for LLM integration
        // In a real app, calls OpenAI/Anthropic/Gemini API here

        const mockResponses = [
            "Based on current market trends, diverse portfolios are performing well.",
            "Consider analyzing the PE ratio before making a decision.",
            "The RSI indicator suggests this stock might be overbought.",
            "Dollar Cost Averaging (DCA) is a great strategy for long term growth."
        ];

        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        return {
            response: randomResponse,
            timestamp: new Date()
        };
    }
};
