import { IProductVariant } from '../models/productVariant.model';

export interface IEffectivePrice {
  price: number;
  originalPrice: number;
  isFlashSale: boolean;
  flashSaleEndsAt: Date | null;
}

export function getEffectivePrice(variant: IProductVariant): IEffectivePrice {
  const now = new Date();
  const isFlashSale =
    variant.flashSalePrice != null &&
    variant.flashSaleEndsAt != null &&
    variant.flashSaleEndsAt > now;

  if (isFlashSale) {
    return {
      price: variant.flashSalePrice!,
      originalPrice: variant.price,
      isFlashSale: true,
      flashSaleEndsAt: variant.flashSaleEndsAt!,
    };
  }
  return {
    price: variant.price,
    originalPrice: variant.originalPrice,
    isFlashSale: false,
    flashSaleEndsAt: null,
  };
}
