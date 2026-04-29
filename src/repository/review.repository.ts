import mongoose from 'mongoose';
import reviewModel from '../models/review.model';

export interface ICreateReviewParams {
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  body?: string;
}

export class ReviewRepository {
  private _model = reviewModel;

  async create(params: ICreateReviewParams) {
    return this._model.create(params);
  }

  async findById(id: string) {
    return this._model.findById(id);
  }

  async findByProductId(productId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this._model
        .find({ productId, isVisible: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments({ productId, isVisible: true }),
    ]);
    return { docs, total };
  }

  async existsByUserAndProduct(userId: string, productId: string) {
    const doc = await this._model.findOne({ userId, productId }).select('_id');
    return !!doc;
  }

  async softDelete(id: string) {
    return this._model.findByIdAndUpdate(id, { isVisible: false }, { new: true });
  }

  async findAllAdmin(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [docs, total] = await Promise.all([
      this._model
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('productId', 'name slug')
        .populate('userId', 'firstName lastName email'),
      this._model.countDocuments(),
    ]);
    return { docs, total };
  }

  async computeProductRating(productId: string): Promise<{ avgRating: number; count: number }> {
    const result = await this._model.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId), isVisible: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (!result.length) return { avgRating: 0, count: 0 };
    return { avgRating: Math.round(result[0].avgRating * 10) / 10, count: result[0].count };
  }
}
