import { BaseRepositoryAbstract } from '@/base/abstract-repository.base';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessagesRepository extends BaseRepositoryAbstract<Message> {
  constructor(
    @InjectModel(Message.name)
    private readonly messages_repository: Model<Message>,
  ) {
    super(messages_repository);
  }

  async findByConversation(
    conversationId: Types.ObjectId,
    skip: number,
    limit: number,
  ) {
    const items = await this.messages_repository
      .find({ conversationId })
      .populate('senderId')
      .populate('productId')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    return items.reverse();
  }

  count(conversationId: Types.ObjectId) {
    return this.messages_repository.countDocuments({ conversationId });
  }
}
