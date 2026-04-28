import wishlistModel from '../models/wishlist.model';

export class WishlistRepository {
  private _model = wishlistModel;

  async findByUserId(userId: string) {
    return this._model.findOne({ userId });
  }

  async addProduct(userId: string, productId: string) {
    return this._model.findOneAndUpdate(
      { userId },
      { $addToSet: { products: productId } },
      { new: true, upsert: true },
    );
  }

  async removeProduct(userId: string, productId: string) {
    return this._model.findOneAndUpdate(
      { userId },
      { $pull: { products: productId } },
      { new: true },
    );
  }
}
