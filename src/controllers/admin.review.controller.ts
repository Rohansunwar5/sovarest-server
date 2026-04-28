import { NextFunction, Request, Response } from 'express';
import reviewService from '../services/review.service';

export const deleteReview = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await reviewService.adminDeleteReview(req.params.id);
  next(response);
};
