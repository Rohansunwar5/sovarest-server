import { NextFunction, Request, Response } from 'express';
import addressService from '../services/address.service';
import wishlistService from '../services/wishlist.service';

// ── Address Book ──────────────────────────────────────────────────────────────

export const listAddresses = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await addressService.listAddresses(req.user._id);
  next(response);
};

export const addAddress = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await addressService.addAddress(req.user._id, req.body);
  next(response);
};

export const updateAddress = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await addressService.updateAddress(req.user._id, req.params.id, req.body);
  next(response);
};

export const deleteAddress = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await addressService.deleteAddress(req.user._id, req.params.id);
  next(response);
};

export const setDefaultAddress = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await addressService.setDefault(req.user._id, req.params.id);
  next(response);
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const getWishlist = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await wishlistService.getWishlist(req.user._id);
  next(response);
};

export const addToWishlist = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await wishlistService.addProduct(req.user._id, req.body.productId);
  next(response);
};

export const removeFromWishlist = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await wishlistService.removeProduct(req.user._id, req.params.productId);
  next(response);
};
