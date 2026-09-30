import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.request';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {}
