import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type IShop = {
  id: string;
  name: string;
  avatar: string;
  shopBanner: string | null;
  shopDescription: string | null;
  joinDate: IDateValue;
  totalProducts: number;
  totalSold: number;
  totalReviews: number;
  avgRating: number;
};
