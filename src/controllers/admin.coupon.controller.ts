import { NextFunction, Request, Response } from 'express';
import couponService from '../services/coupon.service';

export const createCoupon = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await couponService.createCoupon({ ...req.body, createdBy: req.admin._id });
  next(response);
};

export const updateCoupon = async (req: Request, _res: Response, next: NextFunction) => {
  const { id } = req.params;
  const response = await couponService.updateCoupon(id, req.body);
  next(response);
};

export const listCoupons = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await couponService.listCoupons();
  next(response);
};

export const getCoupon = async (req: Request, _res: Response, next: NextFunction) => {
  const { id } = req.params;
  const response = await couponService.getCouponById(id);
  next(response);
};

export const deactivateCoupon = async (req: Request, _res: Response, next: NextFunction) => {
  const { id } = req.params;
  const response = await couponService.deactivateCoupon(id);
  next(response);
};
