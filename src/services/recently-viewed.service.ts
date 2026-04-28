import { ProductRepository } from '../repository/product.repository';
import { ProductVariantRepository } from '../repository/productVariant.repository';
import { recentlyViewedUserCacheManager, recentlyViewedGuestCacheManager } from './cache/entities';

const MAX_RECENTLY_VIEWED = 10;

interface IActor {
  userId?: string;
  sessionId: string;
}

class RecentlyViewedService {
  constructor(
    private readonly _productRepository: ProductRepository,
    private readonly _variantRepository: ProductVariantRepository,
  ) {}

  async trackView(actor: IActor, productSlug: string) {
    const product = await this._productRepository.findBySlug(productSlug);
    if (!product) return;

    const productId = product._id.toString();

    if (actor.userId) {
      const current = (await recentlyViewedUserCacheManager.get({ userId: actor.userId })) ?? [];
      const updated = [productId, ...current.filter(id => id !== productId)].slice(0, MAX_RECENTLY_VIEWED);
      await recentlyViewedUserCacheManager.set({ userId: actor.userId }, updated);
    } else {
      const current = (await recentlyViewedGuestCacheManager.get({ sessionId: actor.sessionId })) ?? [];
      const updated = [productId, ...current.filter(id => id !== productId)].slice(0, MAX_RECENTLY_VIEWED);
      await recentlyViewedGuestCacheManager.set({ sessionId: actor.sessionId }, updated);
    }
  }

  async getRecentlyViewed(actor: IActor) {
    const productIds = actor.userId
      ? ((await recentlyViewedUserCacheManager.get({ userId: actor.userId })) ?? [])
      : ((await recentlyViewedGuestCacheManager.get({ sessionId: actor.sessionId })) ?? []);

    if (!productIds.length) return { products: [] };

    const [products, priceMaps] = await Promise.all([
      this._productRepository.findByIds(productIds),
      this._variantRepository.getMinPriceByProductIds(productIds),
    ]);

    const priceById = new Map(priceMaps.map(p => [p._id.toString(), p]));
    // Restore view order (findByIds doesn't preserve order)
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    const enriched = productIds
      .map(id => productMap.get(id))
      .filter((p): p is NonNullable<typeof p> => !!p && p.isActive)
      .map(p => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        images: p.images,
        badge: p.badge,
        rating: p.rating,
        totalReviews: p.totalReviews,
        minPrice: priceById.get(p._id.toString())?.minPrice ?? 0,
        originalMinPrice: priceById.get(p._id.toString())?.originalMinPrice ?? 0,
      }));

    return { products: enriched };
  }
}

export default new RecentlyViewedService(
  new ProductRepository(),
  new ProductVariantRepository(),
);
