import cartModel, { ICart, ICartItem, ICartCoupon } from '../models/cart.model';

export class CartRepository {
  private _model = cartModel;

  async findByUserId(userId: string): Promise<ICart | null> {
    return this._model.findOne({ userId });
  }

  async findOrCreate(userId: string): Promise<ICart> {
    const existing = await this._model.findOne({ userId });
    if (existing) return existing;
    return this._model.create({ userId, items: [], coupon: null });
  }

  async upsertItem(userId: string, item: ICartItem): Promise<ICart | null> {
    const cart = await this.findOrCreate(userId);

    const idx = cart.items.findIndex(
      i => i.variantId.toString() === item.variantId.toString(),
    );

    if (idx >= 0) {
      cart.items[idx].qty = item.qty;
      cart.items[idx].priceSnapshot = item.priceSnapshot;
      cart.items[idx].originalPriceSnapshot = item.originalPriceSnapshot;
    } else {
      cart.items.push(item);
    }

    return this._model.findOneAndUpdate(
      { userId },
      { items: cart.items },
      { new: true },
    );
  }

  async removeItem(userId: string, variantId: string): Promise<ICart | null> {
    return this._model.findOneAndUpdate(
      { userId },
      { $pull: { items: { variantId } } },
      { new: true },
    );
  }

  async updateItemQty(userId: string, variantId: string, qty: number): Promise<ICart | null> {
    return this._model.findOneAndUpdate(
      { userId, 'items.variantId': variantId },
      { $set: { 'items.$.qty': qty } },
      { new: true },
    );
  }

  async setItems(userId: string, items: ICartItem[]): Promise<ICart | null> {
    return this._model.findOneAndUpdate(
      { userId },
      { items },
      { new: true, upsert: true },
    );
  }

  async clearItems(userId: string): Promise<ICart | null> {
    return this._model.findOneAndUpdate(
      { userId },
      { items: [], coupon: null },
      { new: true },
    );
  }

  async setCoupon(userId: string, coupon: ICartCoupon | null): Promise<ICart | null> {
    return this._model.findOneAndUpdate(
      { userId },
      { coupon },
      { new: true },
    );
  }
}
