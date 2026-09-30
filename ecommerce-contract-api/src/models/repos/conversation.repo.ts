import { BaseRepositoryAbstract } from '@/base/abstract-repository.base';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Conversation } from '../entities/conversation.entity';

@Injectable()
export class ConversationsRepository extends BaseRepositoryAbstract<Conversation> {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversations_repository: Model<Conversation>,
  ) {
    super(conversations_repository);
  }

  findByParticipants(buyerId: Types.ObjectId, sellerId: Types.ObjectId) {
    return this.conversations_repository.findOne({ buyerId, sellerId });
  }

  findAllForUser(userId: Types.ObjectId) {
    return this.conversations_repository
      .find({ $or: [{ buyerId: userId }, { sellerId: userId }] })
      .populate('buyerId')
      .populate('sellerId')
      .sort({ lastMessageAt: -1, created_at: -1 });
  }

  findOneWithPopulate(id: string) {
    return this.conversations_repository
      .findById(id)
      .populate('buyerId')
      .populate('sellerId');
  }
}
