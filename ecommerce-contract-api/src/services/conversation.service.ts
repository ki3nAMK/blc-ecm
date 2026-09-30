import { Role } from '@/enums/role.enum';
import { ClientGateway } from '@/gateways/client.gateway';
import { SellerGateway } from '@/gateways/seller.gateway';
import { ConversationsRepository } from '@/models/repos/conversation.repo';
import { MessagesRepository } from '@/models/repos/message.repo';
import { PaginationDto } from '@/models/requests/pagination.request';
import { UsersService } from '@/services/user.service';
import { toObjectId } from '@/utils/helper';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepo: ConversationsRepository,
    private readonly messagesRepo: MessagesRepository,
    private readonly usersService: UsersService,
    private readonly clientGateway: ClientGateway,
    private readonly sellerGateway: SellerGateway,
  ) {}

  async startConversation(buyerId: string, sellerId: string) {
    if (buyerId === sellerId) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }

    const seller = await this.usersService.getById(sellerId);
    if (!seller || seller.role !== Role.SELLER) {
      throw new NotFoundException('Shop not found');
    }

    const buyerObjectId = toObjectId(buyerId);
    const sellerObjectId = toObjectId(sellerId);

    const existing = await this.conversationsRepo.findByParticipants(
      buyerObjectId,
      sellerObjectId,
    );

    if (existing) {
      const populated = await this.conversationsRepo.findOneWithPopulate(
        existing.id,
      );
      return this.formatConversation(populated, buyerId);
    }

    const created = await this.conversationsRepo.create({
      buyerId: buyerObjectId,
      sellerId: sellerObjectId,
      lastMessage: '',
      lastMessageAt: new Date(),
    } as any);

    const populated = await this.conversationsRepo.findOneWithPopulate(
      created.id,
    );
    return this.formatConversation(populated, buyerId);
  }

  async listForUser(userId: string) {
    const conversations = await this.conversationsRepo.findAllForUser(
      toObjectId(userId),
    );
    return conversations.map((c) => this.formatConversation(c, userId));
  }

  async getMessages(
    conversationId: string,
    userId: string,
    pagination: PaginationDto,
  ) {
    await this.assertParticipant(conversationId, userId);

    const { page = 1, limit = 30 } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.messagesRepo.findByConversation(
        toObjectId(conversationId),
        skip,
        limit,
      ),
      this.messagesRepo.count(toObjectId(conversationId)),
    ]);

    return {
      data: items,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    input: { content?: string; imageUrl?: string; productId?: string },
  ) {
    if (!input.content && !input.imageUrl && !input.productId) {
      throw new BadRequestException('Message must have content, an image, or a product');
    }

    const conversation = await this.assertParticipant(conversationId, senderId);

    const message = await this.messagesRepo.create({
      conversationId: toObjectId(conversationId),
      senderId: toObjectId(senderId),
      content: input.content,
      imageUrl: input.imageUrl,
      productId: input.productId ? toObjectId(input.productId) : undefined,
    } as any);

    const buyerIdStr = this.idOf((conversation as any).buyerId);
    const sellerIdStr = this.idOf((conversation as any).sellerId);
    const isSenderBuyer = senderId === buyerIdStr;
    const recipientId = isSenderBuyer ? sellerIdStr : buyerIdStr;

    const lastMessagePreview =
      input.content || (input.imageUrl ? '📷 Photo' : '🛍️ Shared a product');

    await this.conversationsRepo.update(conversationId, {
      lastMessage: lastMessagePreview,
      lastMessageAt: new Date(),
      ...(isSenderBuyer
        ? { unreadCountSeller: ((conversation as any).unreadCountSeller ?? 0) + 1 }
        : { unreadCountBuyer: ((conversation as any).unreadCountBuyer ?? 0) + 1 }),
    } as any);

    const populatedMessage = await (
      await (message as any).populate('senderId')
    ).populate('productId');

    const payload = { conversationId, message: populatedMessage };

    const gateway = isSenderBuyer ? this.sellerGateway : this.clientGateway;
    gateway.server?.to(recipientId).emit('message:new', payload);

    return populatedMessage;
  }

  async markRead(conversationId: string, userId: string) {
    const conversation = await this.assertParticipant(conversationId, userId);
    const isBuyer = userId === this.idOf((conversation as any).buyerId);

    return this.conversationsRepo.update(
      conversationId,
      (isBuyer
        ? { unreadCountBuyer: 0 }
        : { unreadCountSeller: 0 }) as any,
    );
  }

  private async assertParticipant(conversationId: string, userId: string) {
    const conversation =
      await this.conversationsRepo.findOneWithPopulate(conversationId);

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const buyerIdStr = this.idOf((conversation as any).buyerId);
    const sellerIdStr = this.idOf((conversation as any).sellerId);

    if (userId !== buyerIdStr && userId !== sellerIdStr) {
      throw new ForbiddenException('Not a participant of this conversation');
    }

    return conversation;
  }

  private idOf(participant: any): string {
    return participant?._id?.toString() ?? participant?.toString();
  }

  private formatConversation(conversation: any, currentUserId: string) {
    const buyerIdStr = this.idOf(conversation.buyerId);
    const isBuyer = currentUserId === buyerIdStr;
    const otherParticipant = isBuyer ? conversation.sellerId : conversation.buyerId;

    return {
      id: conversation._id?.toString() ?? conversation.id,
      otherParticipant: {
        id: this.idOf(otherParticipant),
        name: otherParticipant?.name,
        avatar: otherParticipant?.avatar,
        role: otherParticipant?.role,
      },
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      unreadCount: isBuyer
        ? conversation.unreadCountBuyer
        : conversation.unreadCountSeller,
    };
  }
}
