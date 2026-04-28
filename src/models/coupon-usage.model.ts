import mongoose from 'mongoose';

export interface ICouponUsage extends mongoose.Document {
  couponId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  usedAt: Date;
}

const couponUsageSchema = new mongoose.Schema<ICouponUsage>(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    usedAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

couponUsageSchema.index({ couponId: 1, userId: 1 });

export default mongoose.model<ICouponUsage>('CouponUsage', couponUsageSchema);
