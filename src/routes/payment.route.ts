import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { handlePaymentWebhook } from '../controllers/order.controller';

const paymentRouter = Router();

// Razorpay sends raw JSON — rawBody is captured via the express.json verify callback in app.ts
paymentRouter.post('/webhook', asyncHandler(handlePaymentWebhook));

export default paymentRouter;
