import { BaseServiceAbstract } from '@/base/abstract-service.base';
import { Blog } from '@/models/entities/blog.entity';
import { BlogsRepository } from '@/models/repos/blog.repo';
import { CreateBlogDto } from '@/models/requests/create-blog.request';
import { UpdateBlogDto } from '@/models/requests/update-blog.request';
import { PaginationDto } from '@/models/requests/pagination.request';
import { toObjectId } from '@/utils/helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery } from 'mongoose';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

@Injectable()
export class BlogService extends BaseServiceAbstract<Blog> {
  constructor(private readonly blog_repository: BlogsRepository) {
    super(blog_repository);
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let slug = base;
    let attempt = 0;

    while (await this.blog_repository.findOneByCondition({ slug })) {
      attempt += 1;
      slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
      if (attempt > 5) break;
    }

    return slug;
  }

  async createBlog(dto: CreateBlogDto, authorId: string): Promise<Blog> {
    const slug = await this.generateUniqueSlug(dto.title);

    return this.blog_repository.create({
      ...dto,
      slug,
      authorId: toObjectId(authorId),
      publish: dto.publish ?? 'draft',
      totalViews: 0,
    });
  }

  async updateBlog(id: string, dto: UpdateBlogDto): Promise<Blog> {
    const updated = await this.blog_repository.update(id, dto);
    if (!updated) {
      throw new NotFoundException('Blog post not found');
    }
    return updated;
  }

  async publishBlog(id: string): Promise<Blog> {
    return this.updateBlog(id, { publish: 'published' });
  }

  async deleteBlog(id: string): Promise<void> {
    // Hard delete, not the base class's soft delete: blog has no trash/restore UI, and a
    // soft-deleted post would keep occupying its slug forever against the unique index,
    // permanently blocking any future post from reusing that slug.
    const removed = await this.blog_repository.permanentlyDelete(id);
    if (!removed) {
      throw new NotFoundException('Blog post not found');
    }
  }

  async findAllWithPagination(
    pagination: PaginationDto,
    filter: FilterQuery<Blog> = {},
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.blog_repository.findWithPopulate(filter, skip, limit),
      this.blog_repository.count(filter),
    ]);

    return {
      data: items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPublished(pagination: PaginationDto) {
    return this.findAllWithPagination(pagination, { publish: 'published' });
  }

  async findBySlugAndIncrementViews(slug: string): Promise<Blog> {
    const post = await this.blog_repository.incrementViews(slug);
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }

  async findByIdFullPopulate(id: string): Promise<Blog> {
    const post = await this.blog_repository.findOneWithPopulate({ _id: id });
    if (!post) {
      throw new NotFoundException('Blog post not found');
    }
    return post;
  }
}
