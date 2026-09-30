import { Role } from '@/enums/role.enum';
import { User } from '@/models/entities/user.entity';
import { PaginationDto } from '@/models/requests/pagination.request';
import { ProductsRepository } from '@/models/repos/product.repo';
import { UsersService } from '@/services/user.service';
import { toObjectId } from '@/utils/helper';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ShopService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsRepository: ProductsRepository,
  ) {}

  private async buildShopProfile(seller: Partial<User> & { _id?: any }) {
    const id = seller.id ?? seller._id?.toString();
    const stats = await this.productsRepository.getSellerStats(toObjectId(id));

    return {
      id,
      name: seller.name,
      avatar: seller.avatar,
      shopBanner: seller.shopBanner ?? null,
      shopDescription: seller.shopDescription ?? null,
      joinDate: (seller as any).created_at,
      ...stats,
    };
  }

  async getShopProfile(sellerId: string) {
    const seller = await this.usersService.getById(sellerId);
    if (!seller || seller.role !== Role.SELLER) {
      throw new NotFoundException('Shop not found');
    }
    return this.buildShopProfile(seller);
  }

  async getTopShops(limit: number = 4) {
    const sellers = await this.usersService.findMany({
      filter: { role: Role.SELLER },
      skip: 0,
      limit: 200,
    });

    const profiles = await Promise.all(
      sellers.map((seller) => this.buildShopProfile(seller)),
    );

    return profiles
      .sort((a, b) => b.avgRating - a.avgRating || b.totalSold - a.totalSold)
      .slice(0, limit);
  }

  async listShops(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [sellers, total] = await Promise.all([
      this.usersService.findMany({ filter: { role: Role.SELLER }, skip, limit }),
      this.usersService.countUsers({ role: Role.SELLER }),
    ]);

    const data = await Promise.all(
      sellers.map((seller) => this.buildShopProfile(seller)),
    );

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
