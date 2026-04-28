import { NextFunction, Request, Response } from 'express';
import storeAnalyticsService from '../services/store-analytics.service';

export const getRevenue = async (req: Request, _res: Response, next: NextFunction) => {
  const { dateFrom, dateTo } = req.query as Record<string, string>;
  const response = await storeAnalyticsService.getRevenue(dateFrom, dateTo);
  next(response);
};

export const getTopProducts = async (req: Request, _res: Response, next: NextFunction) => {
  const limit = Number(req.query.limit) || 10;
  const response = await storeAnalyticsService.getTopProducts(limit);
  next(response);
};

export const getOrdersByStatus = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await storeAnalyticsService.getOrdersByStatus();
  next(response);
};
