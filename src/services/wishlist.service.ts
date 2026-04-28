import { NotFoundError } from '../errors/not-found.error';
import { WishlistRepository } from '../repository/wishlist.repository';
import { ProductRepository } from '../repository/product.repository';
import { ProductVariantRepository } from '../repository/productVariant.repository';

class WishlistService {
  constructor(
    private readonly _wishlistRepository: WishlistRepository,
    private readonly _productRepository: ProductRepository,
    private readonly _variantRepository: ProductVariantRepository,
  ) {}

  async getWishlist(userId: string) {
    const wishlist = await this._wishlistRepository.findByUserId(userId);
    if (!wishlist?.products.length) return { products: [] };

    const productIds = wishlist.products.map(id => id.toString());
    const [products, priceMaps] = await Promise.all([
      this._productRepository.findByIds(productIds),
      this._variantRepository.getMinPriceByProductIds(productIds),
    ]);

    const priceById = new Map(priceMaps.map(p => [p._id.toString(), p]));

    const enriched = products.map(p => ({
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

  async addProduct(userId: string, productId: string) {
    const product = await this._productRepository.findById(productId);
    if (!product || !product.isActive) throw new NotFoundError('Product not found');

    await this._wishlistRepository.addProduct(userId, productId);
    return true;
  }

  async removeProduct(userId: string, productId: string) {
    await this._wishlistRepository.removeProduct(userId, productId);
    return true;
  }
}

export default new WishlistService(
  new WishlistRepository(),
  new ProductRepository(),
  new ProductVariantRepository(),
);
