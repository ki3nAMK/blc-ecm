import { BaseRepositoryAbstract } from '@/base/abstract-repository.base';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Blog } from '../entities/blog.entity';

@Injectable()
export class BlogsRepository extends BaseRepositoryAbstract<Blog> {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogs_repository: Model<Blog>,
  ) {
    super(blogs_repository);
  }

  findWithPopulate(filter: FilterQuery<Blog>, skip: number, limit: number) {
    return this.blogs_repository
      .find(filter)
      .populate('authorId')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  count(filter: FilterQuery<Blog>) {
    return this.blogs_repository.countDocuments(filter);
  }

  findOneWithPopulate(filter: FilterQuery<Blog>) {
    return this.blogs_repository.findOne(filter).populate('authorId');
  }

  incrementViews(slug: string) {
    return this.blogs_repository
      .findOneAndUpdate(
        { slug, deleted_at: null },
        { $inc: { totalViews: 1 } },
        { new: true },
      )
      .populate('authorId');
  }
}
