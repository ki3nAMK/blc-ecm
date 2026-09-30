import { BaseRepositoryAbstract } from '@/base/abstract-repository.base';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsRepository extends BaseRepositoryAbstract<Product> {
  constructor(
    @InjectModel(Product.name)
    private readonly products_repository: Model<Product>,
  ) {
    super(products_repository);
  }

  findWithPopulate(filter: FilterQuery<Product>, skip: number, limit: number) {
    return this.products_repository
      .find(filter)
      .populate('sellerId')
      .populate('reviews')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
  }

  count(filter: FilterQuery<Product>) {
    return this.products_repository.countDocuments(filter);
  }

  findOneWithPopulate(filter: FilterQuery<Product>) {
    return this.products_repository
      .findOne(filter)
      .populate('sellerId')
      .populate('reviews');
  }

  async getSellerStats(sellerId: Types.ObjectId) {
    const [result] = await this.products_repository.aggregate([
      { $match: { sellerId, deleted_at: null } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalSold: { $sum: { $ifNull: ['$totalSold', 0] } },
          weightedRatingSum: {
            $sum: {
              $multiply: [
                { $ifNull: ['$totalRatings', 0] },
                { $ifNull: ['$totalReviews', 0] },
              ],
            },
          },
          totalReviews: { $sum: { $ifNull: ['$totalReviews', 0] } },
        },
      },
    ]);

    if (!result) {
      return { totalProducts: 0, totalSold: 0, avgRating: 0, totalReviews: 0 };
    }

    const { totalProducts, totalSold, weightedRatingSum, totalReviews } = result;

    return {
      totalProducts,
      totalSold,
      totalReviews,
      avgRating: totalReviews > 0 ? weightedRatingSum / totalReviews : 0,
    };
  }

  activateScheduledFlashSales(now: Date) {
    return this.products_repository.updateMany(
      { 'flashSale.status': 'scheduled', 'flashSale.startTime': { $lte: now } },
      { $set: { 'flashSale.status': 'active' } },
    );
  }

  expireActiveFlashSales(now: Date) {
    return this.products_repository.updateMany(
      { 'flashSale.status': 'active', 'flashSale.endTime': { $lt: now } },
      { $set: { 'flashSale.status': 'expired' } },
    );
  }
}
