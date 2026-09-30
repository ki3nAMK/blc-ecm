import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IConversation = {
  id: string;
  otherParticipant: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  lastMessage: string;
  lastMessageAt: IDateValue;
  unreadCount: number;
};

export type IMessage = {
  id: string;
  conversationId: string;
  senderId: {
    id: string;
    name: string;
    avatar: string;
  } | string;
  content?: string;
  imageUrl?: string;
  productId?: {
    id: string;
    name: string;
    coverUrl: string;
    price: number;
  } | string | null;
  created_at: IDateValue;
};
