import { IsIn, IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.request';

export class FindProductsDto extends PaginationDto {
  @IsOptional()
  @IsIn(['true', 'false'])
  onSale?: string;
}
