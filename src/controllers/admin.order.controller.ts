import { NextFunction, Request, Response } from 'express';
import orderService from '../services/order.service';
import { OrderStatus } from '../models/order.model';

export const adminListOrders = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await orderService.adminListOrders(req.query as Record<string, string>);
  next(response);
};

export const adminGetOrder = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await orderService.adminGetOrder(req.params.orderId);
  next(response);
};

export const adminUpdateOrderStatus = async (req: Request, _res: Response, next: NextFunction) => {
  const { orderId } = req.params;
  const { status, note, trackingInfo } = req.body;
  const response = await orderService.adminUpdateStatus(orderId, status as OrderStatus, note, trackingInfo);
  next(response);
};

export const adminInitiateRefund = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await orderService.adminInitiateRefund(req.params.orderId);
  next(response);
};
