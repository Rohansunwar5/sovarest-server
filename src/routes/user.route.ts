import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { addAddressValidator, updateAddressValidator, wishlistProductValidator } from '../middlewares/validators/address.validator';
import {
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/user.controller';

const userRouter = Router();

userRouter.use(isLoggedIn);

// ── Addresses ─────────────────────────────────────────────────────────────────
userRouter.get('/addresses', asyncHandler(listAddresses));
userRouter.post('/addresses', addAddressValidator, asyncHandler(addAddress));
userRouter.patch('/addresses/:id', updateAddressValidator, asyncHandler(updateAddress));
userRouter.delete('/addresses/:id', asyncHandler(deleteAddress));
userRouter.patch('/addresses/:id/default', asyncHandler(setDefaultAddress));

// ── Wishlist ──────────────────────────────────────────────────────────────────
userRouter.get('/wishlist', asyncHandler(getWishlist));
userRouter.post('/wishlist', wishlistProductValidator, asyncHandler(addToWishlist));
userRouter.delete('/wishlist/:productId', asyncHandler(removeFromWishlist));

export default userRouter;
