import { BadRequestError } from '../../errors/bad-request.error';
import { NotFoundError } from '../../errors/not-found.error';
import { AttributeRepository, IAddAttributeValueParams } from '../../repository/attribute.repository';
import { attributesCacheManager } from '../cache/entities';

const slugify = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

class AttributeService {
  constructor(private readonly _attributeRepository: AttributeRepository) {}

  async createAttribute(params: { name: string; slug?: string; unit?: string }) {
    const { name, unit } = params;
    const slug = params.slug ? slugify(params.slug) : slugify(name);

    const exists = await this._attributeRepository.slugExists(slug);
    if (exists) throw new BadRequestError(`Attribute slug '${slug}' already exists`);

    const attribute = await this._attributeRepository.create({ name, slug, unit });
    return attribute;
  }

  async updateAttribute(id: string, params: { name?: string; unit?: string }) {
    const attribute = await this._attributeRepository.findById(id);
    if (!attribute) throw new NotFoundError('Attribute not found');

    const updated = await this._attributeRepository.update(id, params);

    await attributesCacheManager.remove({ categoryId: 'all' });
    return updated;
  }

  async addValue(attributeId: string, params: IAddAttributeValueParams) {
    const attribute = await this._attributeRepository.findById(attributeId);
    if (!attribute) throw new NotFoundError('Attribute not found');

    const slug = params.slug ? slugify(params.slug) : slugify(params.label);
    const valueSlugExists = attribute.values.some(v => v.slug === slug);
    if (valueSlugExists) throw new BadRequestError(`Value slug '${slug}' already exists on this attribute`);

    const updated = await this._attributeRepository.addValue(attributeId, { ...params, slug });

    await attributesCacheManager.remove({ categoryId: 'all' });
    return updated;
  }

  async removeValue(attributeId: string, valueId: string) {
    const attribute = await this._attributeRepository.findById(attributeId);
    if (!attribute) throw new NotFoundError('Attribute not found');

    const valueExists = attribute.values.some(v => v._id.toString() === valueId);
    if (!valueExists) throw new NotFoundError('Attribute value not found');

    const updated = await this._attributeRepository.removeValue(attributeId, valueId);

    await attributesCacheManager.remove({ categoryId: 'all' });
    return updated;
  }

  async updateValue(attributeId: string, valueId: string, params: Partial<IAddAttributeValueParams>) {
    const attribute = await this._attributeRepository.findById(attributeId);
    if (!attribute) throw new NotFoundError('Attribute not found');

    const value = attribute.values.find(v => v._id.toString() === valueId);
    if (!value) throw new NotFoundError('Attribute value not found');

    const updated = await this._attributeRepository.updateValue(attributeId, valueId, params);

    await attributesCacheManager.remove({ categoryId: 'all' });
    return updated;
  }

  async listAttributes() {
    const cached = await attributesCacheManager.get({ categoryId: 'all' });
    if (cached) return cached;

    const attributes = await this._attributeRepository.findAll(true);
    await attributesCacheManager.set({ categoryId: 'all' }, attributes);
    return attributes;
  }

  async getAttributeById(id: string) {
    const attribute = await this._attributeRepository.findById(id);
    if (!attribute) throw new NotFoundError('Attribute not found');
    return attribute;
  }

  async resolveValueIds(filters: Record<string, string>): Promise<string[]> {
    const entries = Object.entries(filters);
    const attributes = await Promise.all(
      entries.map(([attributeSlug]) => this._attributeRepository.findBySlug(attributeSlug)),
    );

    const valueIds: string[] = [];
    for (let i = 0; i < entries.length; i++) {
      const [, valueSlug] = entries[i];
      const attribute = attributes[i];
      if (!attribute) continue;
      const value = attribute.values.find(v => v.slug === valueSlug && v.isActive);
      if (value) valueIds.push(value._id.toString());
    }

    return valueIds;
  }
}

export default new AttributeService(new AttributeRepository());
