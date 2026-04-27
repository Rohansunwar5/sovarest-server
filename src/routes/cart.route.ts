import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import config from '../config';
import getAuthMiddlewareByJWTSecret from '../middlewares/auth/verify-token.middleware';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import cartSessionMiddleware from '../middlewares/cart-session.middleware';
import { addItemValidator, updateItemQtyValidator } from '../middlewares/validators/cart.validator';
import {
  getCart,
  addItem,
  updateItemQty,
  removeItem,
  clearCart,
  mergeGuestCart,
} from '../controllers/cart.controller';

const cartRouter = Router();

// Silently try to identify the user (sets req.user if token valid, skips if not)
const tryAuth = getAuthMiddlewareByJWTSecret(config.JWT_SECRET);

// All cart routes: optionally authenticated + always have a session ID
cartRouter.use(tryAuth, cartSessionMiddleware);

cartRouter.get('/', asyncHandler(getCart));
cartRouter.post('/items', addItemValidator, asyncHandler(addItem));
cartRouter.patch('/items/:variantId', updateItemQtyValidator, asyncHandler(updateItemQty));
cartRouter.delete('/items/:variantId', asyncHandler(removeItem));
cartRouter.delete('/', asyncHandler(clearCart));

// Merge requires a real logged-in user
cartRouter.post('/merge', isLoggedIn, asyncHandler(mergeGuestCart));

export default cartRouter;
