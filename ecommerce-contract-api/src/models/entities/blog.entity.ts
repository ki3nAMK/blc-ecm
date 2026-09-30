import { BaseEntity } from '@/base/entity.base';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.entity';

@Schema({ timestamps: true })
export class Blog extends BaseEntity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  excerpt: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  coverUrl: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 'draft' })
  publish: string;

  @Prop({ default: 0 })
  totalViews: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  authorId: Types.ObjectId | User;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
