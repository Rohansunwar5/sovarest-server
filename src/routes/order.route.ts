import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { getOrder, getUserOrders, cancelOrder, retryPayment } from '../controllers/order.controller';

const orderRouter = Router();

// Guest-accessible: pass ?email=guest@example.com for identity check
orderRouter.get('/:orderId', asyncHandler(getOrder));

// Auth required
orderRouter.get('/', isLoggedIn, asyncHandler(getUserOrders));
orderRouter.post('/:orderId/cancel', isLoggedIn, asyncHandler(cancelOrder));
orderRouter.post('/:orderId/retry-payment', isLoggedIn, asyncHandler(retryPayment));

export default orderRouter;
