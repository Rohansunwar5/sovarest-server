import attributeModel, { IAttribute } from '../models/attribute.model';

export interface ICreateAttributeParams {
  name: string;
  slug: string;
  unit?: string;
}

export interface IAddAttributeValueParams {
  label: string;
  slug: string;
  meta?: Record<string, string>;
  displayOrder?: number;
}

export class AttributeRepository {
  private _model = attributeModel;

  async create(params: ICreateAttributeParams): Promise<IAttribute> {
    return this._model.create(params);
  }

  async findById(id: string): Promise<IAttribute | null> {
    return this._model.findById(id);
  }

  async findBySlug(slug: string): Promise<IAttribute | null> {
    return this._model.findOne({ slug });
  }

  async findAll(isActive?: boolean): Promise<IAttribute[]> {
    const filter = isActive !== undefined ? { isActive } : {};
    return this._model.find(filter).sort({ name: 1 });
  }

  async findByIds(ids: string[]): Promise<IAttribute[]> {
    return this._model.find({ _id: { $in: ids } });
  }

  async update(id: string, params: Partial<ICreateAttributeParams>): Promise<IAttribute | null> {
    return this._model.findByIdAndUpdate(id, params, { new: true });
  }

  async addValue(attributeId: string, value: IAddAttributeValueParams): Promise<IAttribute | null> {
    return this._model.findByIdAndUpdate(
      attributeId,
      { $push: { values: value } },
      { new: true },
    );
  }

  async removeValue(attributeId: string, valueId: string): Promise<IAttribute | null> {
    return this._model.findByIdAndUpdate(
      attributeId,
      { $pull: { values: { _id: valueId } } },
      { new: true },
    );
  }

  async updateValue(
    attributeId: string,
    valueId: string,
    params: Partial<IAddAttributeValueParams>,
  ): Promise<IAttribute | null> {
    const updateFields: Record<string, unknown> = {};
    if (params.label !== undefined) updateFields['values.$.label'] = params.label;
    if (params.slug !== undefined) updateFields['values.$.slug'] = params.slug;
    if (params.meta !== undefined) updateFields['values.$.meta'] = params.meta;
    if (params.displayOrder !== undefined) updateFields['values.$.displayOrder'] = params.displayOrder;

    return this._model.findOneAndUpdate(
      { _id: attributeId, 'values._id': valueId },
      { $set: updateFields },
      { new: true },
    );
  }

  async slugExists(slug: string): Promise<boolean> {
    const doc = await this._model.findOne({ slug }).select('_id');
    return !!doc;
  }
}
