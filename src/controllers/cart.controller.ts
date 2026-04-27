import { NextFunction, Request, Response } from 'express';
import cartService from '../services/cart.service';

const actor = (req: Request) => ({
  userId: req.user?._id,
  sessionId: req.sessionId,
});

export const getCart = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await cartService.getCart(actor(req));
  next(response);
};

export const addItem = async (req: Request, _res: Response, next: NextFunction) => {
  const { variantId, qty } = req.body;
  const response = await cartService.addItem(actor(req), variantId, Number(qty));
  next(response);
};

export const updateItemQty = async (req: Request, _res: Response, next: NextFunction) => {
  const { variantId } = req.params;
  const { qty } = req.body;
  const response = await cartService.updateItemQty(actor(req), variantId, Number(qty));
  next(response);
};

export const removeItem = async (req: Request, _res: Response, next: NextFunction) => {
  const { variantId } = req.params;
  const response = await cartService.removeItem(actor(req), variantId);
  next(response);
};

export const clearCart = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await cartService.clearCart(actor(req));
  next(response);
};

export const mergeGuestCart = async (req: Request, _res: Response, next: NextFunction) => {
  const { _id: userId } = req.user;
  const { sessionId } = req;
  const response = await cartService.mergeGuestCart(userId, sessionId);
  next(response);
};
