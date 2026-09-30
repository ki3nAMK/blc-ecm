import { CurrentUserId, SkipVerification } from '@/decorators';
import { SessionType } from '@/enums/session-type.enum';
import { JwtAccessTokenGuard } from '@/guards';
import { User } from '@/models/entities/user.entity';
import { UpdateShopProfileDto } from '@/models/requests/update-shop-profile.request';
import { UsersService } from '@/services/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth(SessionType.ACCESS)
@ApiTags('Users')
@UseGuards(JwtAccessTokenGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: () => User })
  @HttpCode(HttpStatus.OK)
  @SkipVerification()
  @Get('/me')
  async getMe(@CurrentUserId() userId: string) {
    await this.userService.ensureReferralCode(userId);
    const result = await this.userService.getById(userId);
    return result;
  }

  @ApiOkResponse({ type: () => User })
  @HttpCode(HttpStatus.OK)
  @Post('/me/become-affiliate')
  async becomeAffiliate(@CurrentUserId() userId: string) {
    return this.userService.becomeAffiliate(userId);
  }

  @ApiOkResponse({ type: () => User })
  @HttpCode(HttpStatus.OK)
  @Patch('/me/shop')
  async updateShopProfile(
    @CurrentUserId() userId: string,
    @Body() dto: UpdateShopProfileDto,
  ) {
    return this.userService.updateShopProfile(userId, dto);
  }
}
