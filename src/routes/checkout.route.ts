import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import config from '../config';
import getAuthMiddlewareByJWTSecret from '../middlewares/auth/verify-token.middleware';
import cartSessionMiddleware from '../middlewares/cart-session.middleware';
import { checkoutValidator } from '../middlewares/validators/checkout.validator';
import { initiateCheckout } from '../controllers/checkout.controller';

const checkoutRouter = Router();

const tryAuth = getAuthMiddlewareByJWTSecret(config.JWT_SECRET);

checkoutRouter.use(tryAuth, cartSessionMiddleware);

checkoutRouter.post('/', checkoutValidator, asyncHandler(initiateCheckout));

export default checkoutRouter;
