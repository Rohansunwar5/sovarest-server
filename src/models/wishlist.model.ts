import mongoose from 'mongoose';

export interface IWishlist extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

const wishlistSchema = new mongoose.Schema<IWishlist>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true },
);

export default mongoose.model<IWishlist>('Wishlist', wishlistSchema);
