import { NextFunction, Request, Response } from 'express';
import reviewService from '../services/review.service';

export const listReviewsAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const response = await reviewService.adminListReviews(page, limit);
  next(response);
};

export const deleteReview = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await reviewService.adminDeleteReview(req.params.id);
  next(response);
};

export const createReviewAdmin = async (req: Request, _res: Response, next: NextFunction) => {
  const { productId, reviewerName, userId, rating, title, body, images } = req.body;
  const response = await reviewService.adminCreateReview({
    productId,
    reviewerName,
    userId: userId || undefined,
    rating: Number(rating),
    title,
    body,
    images,
  });
  next(response);
};
