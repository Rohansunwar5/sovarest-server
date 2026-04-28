import couponUsageModel from '../models/coupon-usage.model';

export class CouponUsageRepository {
  private _model = couponUsageModel;

  async create(params: { couponId: string; userId: string; orderId: string }) {
    return this._model.create(params);
  }

  async countByUserAndCoupon(couponId: string, userId: string) {
    return this._model.countDocuments({ couponId, userId });
  }
}
