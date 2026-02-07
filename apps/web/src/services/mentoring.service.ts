import { api } from "../lib/api";

export interface MentorThread {
    id: string;
    userId: string;
    mentorId: string;
    mentorName: string;
    createdAt: string;
    updatedAt: string;
}

export interface MentorMessage {
    id: string;
    threadId: string;
    sender: 'user' | 'mentor';
    content: string;
    createdAt: string;
}

export const mentoringService = {
    async bookMentor(mentorId: string, mentorName: string, price: number) {
        const response = await api.post<MentorThread>('/mentoring/book', {
            mentorId,
            mentorName,
            price
        });
        return response.data;
    },

    async getThreads() {
        const response = await api.get<MentorThread[]>('/mentoring/threads');
        return response.data;
    },

    async getMessages(threadId: string) {
        const response = await api.get<MentorMessage[]>(`/mentoring/thread/${threadId}/messages`);
        return response.data;
    },

    async sendMessage(threadId: string, content: string) {
        const response = await api.post<MentorMessage>(`/mentoring/thread/${threadId}/messages`, {
            content
        });
        return response.data;
    }
};
