import { CurrentUserId } from '@/decorators';
import { JwtAccessTokenGuard } from '@/guards';
import { PaginationDto } from '@/models/requests/pagination.request';
import { SendMessageDto } from '@/models/requests/send-message.request';
import { StartConversationDto } from '@/models/requests/start-conversation.request';
import { ConversationsService } from '@/services/conversation.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Conversations')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  path: 'conversations',
  version: '1',
})
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Start (or resume) a conversation with a seller/shop' })
  start(@CurrentUserId() userId: string, @Body() dto: StartConversationDto) {
    return this.conversationsService.startConversation(userId, dto.sellerId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List all conversations for the current user' })
  list(@CurrentUserId() userId: string) {
    return this.conversationsService.listForUser(userId);
  }

  @Get(':id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get paginated messages for a conversation' })
  @ApiParam({ name: 'id', example: '65fb1234567890abcdef1234' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 30 })
  getMessages(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.conversationsService.getMessages(id, userId, pagination);
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Send a message in a conversation' })
  @ApiParam({ name: 'id', example: '65fb1234567890abcdef1234' })
  sendMessage(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.conversationsService.sendMessage(id, userId, dto);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Mark a conversation as read' })
  @ApiParam({ name: 'id', example: '65fb1234567890abcdef1234' })
  markRead(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.conversationsService.markRead(id, userId);
  }
}
