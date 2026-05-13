import mongoose from 'mongoose';

export interface IReview extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  reviewerName?: string;
  isAdminCreated: boolean;
  rating: number;
  title: string;
  body: string;
  images: string[];
  isVisible: boolean;
}

const reviewSchema = new mongoose.Schema<IReview>(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, default: null },
    orderId: { type: mongoose.Schema.Types.ObjectId, default: null },
    reviewerName: { type: String, trim: true, maxlength: 100, default: null },
    isAdminCreated: { type: Boolean, default: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, default: '', maxlength: 2000 },
    images: { type: [String], default: [] },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Enforce one review per user per product only for real user reviews
reviewSchema.index(
  { productId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { userId: { $exists: true, $ne: null } } },
);
reviewSchema.index({ productId: 1, isVisible: 1, createdAt: -1 });

export default mongoose.model<IReview>('Review', reviewSchema);
