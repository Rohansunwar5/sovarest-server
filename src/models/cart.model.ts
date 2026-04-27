import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, required: true },
    productName: { type: String, required: true },
    productSlug: { type: String, required: true },
    sku: { type: String, required: true },
    image: { type: String, default: '' },
    attributeLabels: { type: [String], default: [] },
    priceSnapshot: { type: Number, required: true },
    originalPriceSnapshot: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    discountAmount: { type: Number, required: true },
    couponId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
    coupon: { type: couponSchema, default: null },
  },
  { timestamps: true },
);

cartSchema.index({ userId: 1 });

export interface ICartItem {
  variantId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  productName: string;
  productSlug: string;
  sku: string;
  image: string;
  attributeLabels: string[];
  priceSnapshot: number;
  originalPriceSnapshot: number;
  qty: number;
}

export interface ICartCoupon {
  code: string;
  discountAmount: number;
  couponId: mongoose.Types.ObjectId;
}

export interface ICart extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  coupon: ICartCoupon | null;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<ICart>('Cart', cartSchema);
