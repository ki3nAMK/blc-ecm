import type { IMessage, IConversation } from "@/types/message";

import { isNil } from "lodash";

import { http } from "../baseRequest";

export interface IMessagesResponse {
    data: IMessage[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const messageService = {
    startConversation: (sellerId: string): Promise<IConversation> =>
        http.axios.request({
            method: 'POST',
            url: `/conversations`,
            data: { sellerId },
        }),

    getConversations: (): Promise<IConversation[]> =>
        http.axios.request({
            method: 'GET',
            url: `/conversations`,
        }),

    getMessages: (conversationId: string, page?: number, limit?: number): Promise<IMessagesResponse> =>
        http.axios.request({
            method: 'GET',
            url: `/conversations/${conversationId}/messages?page=${isNil(page) ? 1 : page}&limit=${isNil(limit) ? 30 : limit}`,
        }),

    sendMessage: (
        conversationId: string,
        payload: { content?: string; imageUrl?: string; productId?: string }
    ): Promise<IMessage> =>
        http.axios.request({
            method: 'POST',
            url: `/conversations/${conversationId}/messages`,
            data: payload,
        }),

    markRead: (conversationId: string): Promise<void> =>
        http.axios.request({
            method: 'PATCH',
            url: `/conversations/${conversationId}/read`,
        }),
};

export default messageService;
