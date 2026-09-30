import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class SetFlashSaleDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  discountedPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  discountedEscrow: number;

  @ApiProperty()
  @IsDateString()
  startTime: string;

  @ApiProperty()
  @IsDateString()
  endTime: string;

  @ApiProperty({ description: 'Tx hash of the on-chain setFlashSale call — this endpoint only mirrors state that already succeeded on-chain' })
  @IsString()
  @IsNotEmpty()
  txHash: string;
}
