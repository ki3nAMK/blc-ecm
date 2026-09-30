import type { IDateValue } from 'src/types/common';
import type { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

type FlashSaleAwareProduct = Pick<IProductItem, 'price' | 'flashSale'>;

export type EffectiveFlashSale = {
  isActive: boolean;
  discountedPrice: number;
  discountedEscrow?: number;
  endTime?: IDateValue;
};

// Flash sale UI is fully built and working end-to-end (contract, backend, seller flow),
// but paused for later at the user's request — flip this back to `true` to re-enable it
// everywhere at once, since every display surface reads through getEffectiveFlashSale.
export const FLASH_SALE_ENABLED = false;

// Single source of truth for "is this product's flash sale live right now" — used by
// every price-rendering call site, badges, the home section, and checkout, so the check
// only exists in one place. Mirrors the on-chain Escrow.getEffectivePrice window check.
export function getEffectiveFlashSale(product: FlashSaleAwareProduct) {
  if (!FLASH_SALE_ENABLED) {
    return { isActive: false, discountedPrice: product.price, discountedEscrow: undefined, endTime: undefined };
  }

  const fs = product.flashSale;
  const now = Date.now();
  const isActive =
    !!fs &&
    fs.status === 'active' &&
    new Date(fs.startTime!).getTime() <= now &&
    new Date(fs.endTime!).getTime() >= now;

  return {
    isActive,
    discountedPrice: isActive ? fs!.discountedPrice : product.price,
    discountedEscrow: isActive ? fs!.discountedEscrow : undefined,
    endTime: fs?.endTime,
  };
}
