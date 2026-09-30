import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class StartConversationDto {
  @ApiProperty({ description: 'The seller (shop owner) to start a conversation with' })
  @IsMongoId()
  @IsNotEmpty()
  sellerId: string;
}
