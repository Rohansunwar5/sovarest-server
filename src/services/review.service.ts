import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import { ReviewRepository } from '../repository/review.repository';
import { ProductRepository } from '../repository/product.repository';
import { OrderRepository } from '../repository/order.repository';

class ReviewService {
  constructor(
    private readonly _reviewRepository: ReviewRepository,
    private readonly _productRepository: ProductRepository,
    private readonly _orderRepository: OrderRepository,
  ) {}

  async listReviews(productSlug: string, page: number, limit: number) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(20, Math.max(1, limit));

    const product = await this._productRepository.findBySlug(productSlug);
    if (!product) throw new NotFoundError('Product not found');

    const { docs, total } = await this._reviewRepository.findByProductId(
      product._id.toString(),
      safePage,
      safeLimit,
    );

    return {
      reviews: docs,
      pagination: { total, page: safePage, limit: safeLimit, pages: Math.ceil(total / safeLimit) },
    };
  }

  async createReview(
    userId: string,
    productSlug: string,
    params: { rating: number; title: string; body?: string; images?: string[] },
  ) {
    const product = await this._productRepository.findBySlug(productSlug);
    if (!product) throw new NotFoundError('Product not found');

    const productId = product._id.toString();

    // Verified purchase check
    const deliveredOrder = await this._orderRepository.findDeliveredOrderWithProduct(userId, productId);
    if (!deliveredOrder)
      throw new BadRequestError('You can only review products from delivered orders');

    const alreadyReviewed = await this._reviewRepository.existsByUserAndProduct(userId, productId);
    if (alreadyReviewed)
      throw new BadRequestError('You have already reviewed this product');

    const review = await this._reviewRepository.create({
      productId,
      userId,
      orderId: deliveredOrder._id.toString(),
      ...params,
    });

    await this._recomputeRating(productId);
    return review;
  }

  async adminListReviews(page: number, limit: number) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));
    const { docs, total } = await this._reviewRepository.findAllAdmin(safePage, safeLimit);
    return {
      reviews: docs,
      pagination: { total, page: safePage, limit: safeLimit, pages: Math.ceil(total / safeLimit) },
    };
  }

  async adminDeleteReview(reviewId: string) {
    const review = await this._reviewRepository.findById(reviewId);
    if (!review) throw new NotFoundError('Review not found');

    const updated = await this._reviewRepository.softDelete(reviewId);
    await this._recomputeRating(review.productId.toString());
    return updated;
  }

  private async _recomputeRating(productId: string) {
    const { avgRating, count } = await this._reviewRepository.computeProductRating(productId);
    await this._productRepository.updateRating(productId, avgRating, count);
  }
}

export default new ReviewService(
  new ReviewRepository(),
  new ProductRepository(),
  new OrderRepository(),
);
