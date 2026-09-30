import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IChatAttachment = {
  name: string;
  size: number;
  type: string;
  path: string;
  preview: string;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export interface IMention {
  userId: string;
  displayName: string;
  startIndex: number;
  endIndex: number;
  id: string;
}

export interface IUrl {
  url: string;
  thumbnailImage: string;
  startIndex: number;
  endIndex: number;
  description: string;
  title: string;
}

export type IChatMessage = {
  id: string;
  body: string;
  senderId: string;
  contentType: string;
  createdAt: IDateValue;
  attachments: IChatAttachment[];
  mentions?: IMention[];
  previewUrl?: IUrl[];
  replyInfo?: IReplyMessage;
};

export type IReplyMessage = {
  messageId: string;
  body: string;
  senderName: string;
  isImage?: boolean;
};

export type IChatParticipant = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  avatarUrl: string;
  avatar: string;
  location: string;
  phone_number: string;
  phoneNumber: string;
  lastActivity: IDateValue;
  status: 'online' | 'offline' | 'alway' | 'busy';
};

export type IChatConversation = {
  id: string;
  type: string;
  unreadCount: number;
  messages: IChatMessage[];
  participants: IChatParticipant[];
};

export type IChatConversations = {
  byId: Record<string, IChatConversation>;
  allIds: string[];
};
