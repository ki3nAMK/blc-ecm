import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateShopProfileDto {
  @ApiProperty({ required: false, description: 'Shop banner image URL' })
  @IsOptional()
  @IsString()
  shopBanner?: string;

  @ApiProperty({ required: false, description: 'Shop description shown on the public shop page' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  shopDescription?: string;
}
