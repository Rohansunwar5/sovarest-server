import Razorpay from 'razorpay';
import crypto from 'crypto';
import config from '../config';

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (params: {
  amountInPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}) => {
  return razorpay.orders.create({
    amount: params.amountInPaise,
    currency: 'INR',
    receipt: params.receipt,
    notes: params.notes,
  });
};

export const verifyWebhookSignature = (rawBody: Buffer, signature: string): boolean => {
  const expected = crypto
    .createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');
  return expected === signature;
};
