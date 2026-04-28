import { NextFunction, Request, Response } from 'express';
import orderService from '../services/order.service';

export const handlePaymentWebhook = async (req: Request, _res: Response, next: NextFunction) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const response = await orderService.processWebhook(req.rawBody!, signature, req.body);
  next(response);
};

export const getOrder = async (req: Request, _res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const { email } = req.query;
  const response = await orderService.getOrder(orderId, req.user?._id, email as string | undefined);
  next(response);
};

export const getUserOrders = async (req: Request, _res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const response = await orderService.getUserOrders(req.user._id, page, limit);
  next(response);
};

export const cancelOrder = async (req: Request, _res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const response = await orderService.cancelOrder(orderId, req.user._id);
  next(response);
};

export const retryPayment = async (req: Request, _res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const response = await orderService.retryPayment(orderId, req.user._id);
  next(response);
};
