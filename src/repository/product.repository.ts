import productModel, { IProduct } from '../models/product.model';

export interface ICreateProductParams {
  name: string;
  slug: string;
  description?: string;
  details?: string;
  materials?: string;
  shipping?: string;
  category: string;
  images?: string[];
  badge?: { label: string; variant: 'primary' | 'accent' } | null;
  isFeatured?: boolean;
}

export interface IProductFilter {
  categoryId?: string;
  productIds?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface IProductSort {
  field: 'rating' | 'createdAt';
  direction: 1 | -1;
}

export class ProductRepository {
  private _model = productModel;

  async create(params: ICreateProductParams): Promise<IProduct> {
    return this._model.create(params);
  }

  async findById(id: string): Promise<IProduct | null> {
    return this._model.findById(id);
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    return this._model.findOne({ slug, isActive: true });
  }

  async findBySlugAdmin(slug: string): Promise<IProduct | null> {
    return this._model.findOne({ slug });
  }

  async findWithFilters(params: {
    filter: IProductFilter;
    sort: IProductSort;
    skip: number;
    limit: number;
  }): Promise<{ docs: IProduct[]; total: number }> {
    const { filter, sort, skip, limit } = params;

    const query: Record<string, unknown> = {};
    if (filter.isActive !== undefined) query.isActive = filter.isActive;
    if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
    if (filter.categoryId) query.category = filter.categoryId;
    if (filter.productIds?.length) query._id = { $in: filter.productIds };

    const [docs, total] = await Promise.all([
      this._model
        .find(query)
        .sort({ [sort.field]: sort.direction })
        .skip(skip)
        .limit(limit),
      this._model.countDocuments(query),
    ]);

    return { docs, total };
  }

  async update(id: string, params: Partial<ICreateProductParams>): Promise<IProduct | null> {
    return this._model.findByIdAndUpdate(id, params, { new: true });
  }

  async updateRating(
    productId: string,
    rating: number,
    totalReviews: number,
  ): Promise<IProduct | null> {
    return this._model.findByIdAndUpdate(
      productId,
      { rating, totalReviews },
      { new: true },
    );
  }

  async softDelete(id: string): Promise<IProduct | null> {
    return this._model.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async slugExists(slug: string): Promise<boolean> {
    const doc = await this._model.findOne({ slug }).select('_id');
    return !!doc;
  }
}
