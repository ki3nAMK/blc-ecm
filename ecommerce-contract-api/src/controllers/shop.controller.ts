import { PaginationDto } from '@/models/requests/pagination.request';
import { ShopService } from '@/services/shop.service';
import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Shops')
@Controller({
  path: 'shops',
  version: '1',
})
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'List all shops (sellers) with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  list(@Query() query: PaginationDto) {
    return this.shopService.listShops(query);
  }

  @Get('top')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get top-rated shops (for homepage display)' })
  @ApiQuery({ name: 'limit', required: false, example: 4 })
  getTop(@Query('limit') limit?: string) {
    return this.shopService.getTopShops(limit ? parseInt(limit, 10) : 4);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Get a shop (seller) profile with aggregated stats' })
  @ApiParam({ name: 'id', example: '65fb1234567890abcdef1234' })
  async getOne(@Param('id') id: string) {
    const data = await this.shopService.getShopProfile(id);
    return { data };
  }
}
