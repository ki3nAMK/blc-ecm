import { BaseEntity } from '@/base/entity.base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Conversation } from './conversation.entity';
import { Product } from './product.entity';
import { User } from './user.entity';

@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Message extends BaseEntity {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId | Conversation;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId | User;

  @Prop()
  content: string;

  @Prop()
  imageUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId | Product;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ conversationId: 1, created_at: -1 });
