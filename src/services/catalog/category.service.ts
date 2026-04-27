import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { CategoryRepository, ICreateCategoryParams } from '../../repository/category.repository';
import { AttributeRepository } from '../../repository/attribute.repository';
import { categoriesCacheManager } from '../cache/entities';

const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

class CategoryService {
  constructor(
    private readonly _categoryRepository: CategoryRepository,
    private readonly _attributeRepository: AttributeRepository,
  ) {}

  async createCategory(params: {
    name: string;
    slug?: string;
    description?: string;
    image?: string;
    attributes?: { attributeId: string; displayOrder: number }[];
    displayOrder?: number;
  }) {
    const slug = params.slug ? slugify(params.slug) : slugify(params.name);

    const exists = await this._categoryRepository.slugExists(slug);
    if (exists) throw new BadRequestError(`Category slug '${slug}' already exists`);

    if (params.attributes?.length) {
      const attributeIds = params.attributes.map(a => a.attributeId);
      const found = await this._attributeRepository.findByIds(attributeIds);
      if (found.length !== attributeIds.length) throw new NotFoundError('One or more attributes not found');
    }

    const createParams: ICreateCategoryParams = {
      name: params.name,
      slug,
      description: params.description,
      image: params.image,
      attributes: params.attributes,
      displayOrder: params.displayOrder,
    };

    const category = await this._categoryRepository.create(createParams);
    await categoriesCacheManager.remove({ key: 'all' });
    return category;
  }

  async updateCategory(
    id: string,
    params: {
      name?: string;
      description?: string;
      image?: string;
      attributes?: { attributeId: string; displayOrder: number }[];
      displayOrder?: number;
      isActive?: boolean;
    },
  ) {
    const category = await this._categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found');

    if (params.attributes?.length) {
      const attributeIds = params.attributes.map(a => a.attributeId);
      const found = await this._attributeRepository.findByIds(attributeIds);
      if (found.length !== attributeIds.length) throw new NotFoundError('One or more attributes not found');
    }

    const updated = await this._categoryRepository.update(id, params);
    await categoriesCacheManager.remove({ key: 'all' });
    return updated;
  }

  async listCategories() {
    const cached = await categoriesCacheManager.get({ key: 'all' });
    if (cached) return cached;

    const categories = await this._categoryRepository.findAll(true);
    await categoriesCacheManager.set({ key: 'all' }, categories);
    return categories;
  }

  async listCategoriesAdmin() {
    return this._categoryRepository.findAll();
  }

  async getCategoryBySlug(slug: string) {
    const category = await this._categoryRepository.findBySlug(slug);
    if (!category) throw new NotFoundError('Category not found');
    return category;
  }
}

export default new CategoryService(new CategoryRepository(), new AttributeRepository());
