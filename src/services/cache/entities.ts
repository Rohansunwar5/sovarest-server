import CacheManager from './manager';

interface IEncodedJWTCacheResponse {
  iv: string;
  encryptedData: string;
}

interface IEncodedJWTCacheManagerParams {
  userId: string;
}

interface IProfileCacheManagerParams {
  userId: string;
}

interface IOTPCacheManagerParams {
  userId: string;
}

interface IGameImpressionCacheManagerParams {
  ip: string;
  country: string;
  gameId: string;
}

interface IGameCacheParams {
  gameId: string;
}

interface IAdminJWTCacheParams {
  adminId: string;
}

interface IEncodedAdminJWTCacheResponse {
  iv: string;
  encryptedData: string;
}

interface IProductDetailCacheParams {
  slug: string;
}

interface IProductListCacheParams {
  queryHash: string;
}

interface ICategoriesCacheParams {
  key: string;
}

interface IAttributesCacheParams {
  categoryId: string;
}

interface IGuestCartCacheParams {
  sessionId: string;
}

interface IRecentlyViewedUserParams {
  userId: string;
}

interface IRecentlyViewedGuestParams {
  sessionId: string;
}

export interface IGuestCartItem {
  variantId: string;
  productId: string;
  productName: string;
  productSlug: string;
  sku: string;
  image: string;
  attributeLabels: string[];
  priceSnapshot: number;
  originalPriceSnapshot: number;
  qty: number;
}

export interface IGuestCart {
  sessionId: string;
  items: IGuestCartItem[];
  coupon: { code: string; discountAmount: number; couponId: string } | null;
  updatedAt: string;
}

const encodedJWTCacheManager = CacheManager<IEncodedJWTCacheManagerParams, IEncodedJWTCacheResponse>('encoded-JWT', 86400);
const profileCacheManager = CacheManager<IProfileCacheManagerParams>('profile', 360);
const otpDeleteAccountCacheManager = CacheManager<IOTPCacheManagerParams, { code: string }>('otp-Delete-Account', 600);
const gameImpressionCacheManager = CacheManager<IGameImpressionCacheManagerParams>('game-impression', 120);
const gameCacheManager = CacheManager<IGameCacheParams>('game', 360);

const adminJWTCacheManager = CacheManager<IAdminJWTCacheParams, IEncodedAdminJWTCacheResponse>('admin-encoded-JWT', 86400);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const productDetailCacheManager = CacheManager<IProductDetailCacheParams, any>('catalog-product-detail', 900);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const productListCacheManager = CacheManager<IProductListCacheParams, any>('catalog-product-list', 600);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoriesCacheManager = CacheManager<ICategoriesCacheParams, any>('catalog-categories', 3600);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const attributesCacheManager = CacheManager<IAttributesCacheParams, any>('catalog-attributes', 3600);
const guestCartCacheManager = CacheManager<IGuestCartCacheParams, IGuestCart>('cart-guest', 604800);
// 30 days for users, 7 days for guests
const recentlyViewedUserCacheManager = CacheManager<IRecentlyViewedUserParams, string[]>('recently-viewed-user', 2592000);
const recentlyViewedGuestCacheManager = CacheManager<IRecentlyViewedGuestParams, string[]>('recently-viewed-guest', 604800);

export {
  encodedJWTCacheManager,
  profileCacheManager,
  otpDeleteAccountCacheManager,
  gameImpressionCacheManager,
  gameCacheManager,
  adminJWTCacheManager,
  productDetailCacheManager,
  productListCacheManager,
  categoriesCacheManager,
  attributesCacheManager,
  guestCartCacheManager,
  recentlyViewedUserCacheManager,
  recentlyViewedGuestCacheManager,
};
