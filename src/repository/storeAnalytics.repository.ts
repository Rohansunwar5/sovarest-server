import orderModel from '../models/order.model';

export class StoreAnalyticsRepository {
  private _orderModel = orderModel;

  async getRevenue(dateFrom: Date, dateTo: Date) {
    const result = await this._orderModel.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
          createdAt: { $gte: dateFrom, $lte: dateTo },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$billing.total' },
          orderCount: { $sum: 1 },
          avgOrderValue: { $avg: '$billing.total' },
        },
      },
    ]);
    return result[0] ?? { totalRevenue: 0, orderCount: 0, avgOrderValue: 0 };
  }

  async getTopProducts(limit: number) {
    return this._orderModel.aggregate([
      { $match: { status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          productName: { $first: '$items.productName' },
          totalQtySold: { $sum: '$items.qty' },
          totalRevenue: { $sum: { $multiply: ['$items.priceAtPurchase', '$items.qty'] } },
        },
      },
      { $sort: { totalQtySold: -1 } },
      { $limit: limit },
    ]);
  }

  async getOrdersByStatus() {
    const result = await this._orderModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return result.map(r => ({ status: r._id, count: r.count }));
  }
}
