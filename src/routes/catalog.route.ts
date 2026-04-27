import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import {
  listCategories,
  listAttributes,
  listProducts,
  getFeaturedProducts,
  getBestsellers,
  getProductBySlug,
} from '../controllers/catalog.controller';

const catalogRouter = Router();

catalogRouter.get('/categories', asyncHandler(listCategories));
catalogRouter.get('/attributes', asyncHandler(listAttributes));

catalogRouter.get('/products', asyncHandler(listProducts));
catalogRouter.get('/products/featured', asyncHandler(getFeaturedProducts));
catalogRouter.get('/products/bestsellers', asyncHandler(getBestsellers));
catalogRouter.get('/products/:slug', asyncHandler(getProductBySlug));

export default catalogRouter;
