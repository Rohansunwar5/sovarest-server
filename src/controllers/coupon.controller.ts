import { NextFunction, Request, Response } from 'express';
import cartService from '../services/cart.service';

const actor = (req: Request) => ({
  userId: req.user?._id,
  sessionId: req.sessionId,
});

export const applyCoupon = async (req: Request, _res: Response, next: NextFunction) => {
  const { code } = req.body;
  const response = await cartService.applyCoupon(actor(req), code);
  next(response);
};

export const removeCoupon = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await cartService.removeCoupon(actor(req));
  next(response);
};
