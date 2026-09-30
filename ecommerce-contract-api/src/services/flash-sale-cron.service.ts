import { ProductsRepository } from '@/models/repos/product.repo';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

// Keeps MongoDB's mirrored flashSale.status in sync for UI display (badges, "on sale"
// filtering) — this is cosmetic only. Settlement correctness never depends on it: the
// Escrow contract enforces the discount window itself, and each order snapshots the
// price it actually paid at deposit time, independent of this job's schedule.
@Injectable()
export class FlashSaleCronService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async syncFlashSaleStatuses() {
    const now = new Date();
    await this.productsRepository.activateScheduledFlashSales(now);
    await this.productsRepository.expireActiveFlashSales(now);
  }
}
