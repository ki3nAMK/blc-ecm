import { CurrentUserId, SkipVerification } from '@/decorators';
import { AdminGuard, JwtAccessTokenGuard } from '@/guards';
import { CreateBlogDto } from '@/models/requests/create-blog.request';
import { PaginationDto } from '@/models/requests/pagination.request';
import { UpdateBlogDto } from '@/models/requests/update-blog.request';
import { SessionType } from '@/enums/session-type.enum';
import { BlogService } from '@/services/blog.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Blog')
@Controller({
  path: 'blog',
  version: '1',
})
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @SkipVerification()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get published blog posts with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: PaginationDto) {
    return this.blogService.findPublished(query);
  }

  @SkipVerification()
  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get a published blog post by slug (increments view count)' })
  @ApiParam({ name: 'slug', example: 'my-first-post' })
  async findOne(@Param('slug') slug: string) {
    const data = await this.blogService.findBySlugAndIncrementViews(slug);
    return { data };
  }
}

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Admin Blog')
@Controller({
  path: 'admin/blog',
  version: '1',
})
@UseGuards(JwtAccessTokenGuard, AdminGuard)
export class AdminBlogController {
  constructor(
    private readonly blogService: BlogService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiOkResponse({ description: 'Create a new blog post (draft by default)' })
  create(@Body() dto: CreateBlogDto, @CurrentUserId() authorId: string) {
    return this.blogService.createBlog(dto, authorId);
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/blog',
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOkResponse({ description: 'Upload a blog cover image, returns its public URL' })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    const publicUrl = this.configService.get('publicUrl');
    return { url: `${publicUrl}/uploads/blog/${file.filename}` };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get all blog posts (including drafts) with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query() query: PaginationDto) {
    return this.blogService.findAllWithPagination(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get a blog post by id, fully populated' })
  async findOne(@Param('id') id: string) {
    const data = await this.blogService.findByIdFullPopulate(id);
    return { data };
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Update a blog post' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.updateBlog(id, dto);
  }

  @Patch(':id/publish')
  @ApiOkResponse({ description: 'Publish a blog post' })
  publish(@Param('id') id: string) {
    return this.blogService.publishBlog(id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Delete a blog post' })
  async remove(@Param('id') id: string) {
    await this.blogService.deleteBlog(id);
    return { success: true };
  }
}
