import addressModel, { IAddress } from '../models/address.model';

export interface ICreateAddressParams {
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export class AddressRepository {
  private _model = addressModel;

  async create(params: ICreateAddressParams, isDefault: boolean) {
    return this._model.create({ ...params, isDefault });
  }

  async findById(id: string) {
    return this._model.findById(id);
  }

  async findByUserId(userId: string) {
    return this._model.find({ userId }).sort({ isDefault: -1, createdAt: 1 });
  }

  async update(id: string, params: Partial<ICreateAddressParams>) {
    return this._model.findByIdAndUpdate(id, params, { new: true });
  }

  async delete(id: string) {
    return this._model.findByIdAndDelete(id);
  }

  async countByUserId(userId: string) {
    return this._model.countDocuments({ userId });
  }

  async clearDefault(userId: string) {
    await this._model.updateMany({ userId }, { isDefault: false });
  }

  async setDefault(id: string) {
    return this._model.findByIdAndUpdate(id, { isDefault: true }, { new: true });
  }
}
