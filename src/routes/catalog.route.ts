import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import config from '../config';
import getAuthMiddlewareByJWTSecret from '../middlewares/auth/verify-token.middleware';
import cartSessionMiddleware from '../middlewares/cart-session.middleware';
import {
  listCategories,
  listAttributes,
  listProducts,
  getFeaturedProducts,
  getBestsellers,
  getProductBySlug,
  searchProducts,
  getRelatedProducts,
  trackRecentlyViewed,
  getRecentlyViewed,
} from '../controllers/catalog.controller';
import { listReviews, createReview } from '../controllers/review.controller';
import { createReviewValidator } from '../middlewares/validators/review.validator';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';

const catalogRouter = Router();

// Silently identify user for optional-auth routes (recently viewed, track view)
const tryAuth = getAuthMiddlewareByJWTSecret(config.JWT_SECRET);

catalogRouter.get('/categories', asyncHandler(listCategories));
catalogRouter.get('/attributes', asyncHandler(listAttributes));

// ── Search ────────────────────────────────────────────────────────────────────
catalogRouter.get('/search', asyncHandler(searchProducts));

// ── Products ──────────────────────────────────────────────────────────────────
catalogRouter.get('/products', asyncHandler(listProducts));
catalogRouter.get('/products/featured', asyncHandler(getFeaturedProducts));
catalogRouter.get('/products/bestsellers', asyncHandler(getBestsellers));
catalogRouter.get('/products/:slug', asyncHandler(getProductBySlug));
catalogRouter.get('/products/:slug/related', asyncHandler(getRelatedProducts));

// ── Recently Viewed ───────────────────────────────────────────────────────────
catalogRouter.post('/products/:slug/view', tryAuth, cartSessionMiddleware, asyncHandler(trackRecentlyViewed));
catalogRouter.get('/recently-viewed', tryAuth, cartSessionMiddleware, asyncHandler(getRecentlyViewed));

// ── Reviews ───────────────────────────────────────────────────────────────────
catalogRouter.get('/products/:slug/reviews', asyncHandler(listReviews));
catalogRouter.post('/products/:slug/reviews', isLoggedIn, createReviewValidator, asyncHandler(createReview));

export default catalogRouter;
