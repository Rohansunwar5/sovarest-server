import mongoose from 'mongoose';

export interface IReview extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  body: string;
  isVisible: boolean;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, default: '', maxlength: 2000 },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// One review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.index({ productId: 1, isVisible: 1, createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);
