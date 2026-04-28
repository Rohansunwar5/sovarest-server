import { NextFunction, Request, Response } from 'express';
import reviewService from '../services/review.service';

export const listReviews = async (req: Request, _res: Response, next: NextFunction) => {
  const { slug } = req.params;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const response = await reviewService.listReviews(slug, page, limit);
  next(response);
};

export const createReview = async (req: Request, _res: Response, next: NextFunction) => {
  const { slug } = req.params;
  const response = await reviewService.createReview(req.user._id, slug, req.body);
  next(response);
};
