import { NextFunction, Request, Response } from 'express';
import checkoutService from '../services/checkout.service';

export const initiateCheckout = async (req: Request, _res: Response, next: NextFunction) => {
  const actor = { userId: req.user?._id, sessionId: req.sessionId };
  const response = await checkoutService.initiateCheckout(actor, req.body);
  next(response);
};
