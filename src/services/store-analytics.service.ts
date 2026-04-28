import { BadRequestError } from '../errors/bad-request.error';
import { StoreAnalyticsRepository } from '../repository/storeAnalytics.repository';

class StoreAnalyticsService {
  constructor(private readonly _analyticsRepository: StoreAnalyticsRepository) {}

  async getRevenue(dateFrom: string, dateTo: string) {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    if (isNaN(from.getTime()) || isNaN(to.getTime()))
      throw new BadRequestError('Invalid date range');
    if (from > to) throw new BadRequestError('dateFrom must be before dateTo');

    return this._analyticsRepository.getRevenue(from, to);
  }

  async getTopProducts(limit = 10) {
    const safeLimit = Math.min(50, Math.max(1, limit));
    return this._analyticsRepository.getTopProducts(safeLimit);
  }

  async getOrdersByStatus() {
    return this._analyticsRepository.getOrdersByStatus();
  }
}

export default new StoreAnalyticsService(new StoreAnalyticsRepository());
