import adminModel from '../models/admin.model';

export interface ICreateAdminParams {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export class AdminRepository {
  private _model = adminModel;

  async create(params: ICreateAdminParams) {
    return this._model.create(params);
  }

  async findByEmail(email: string) {
    return this._model.findOne({ email: email.toLowerCase() });
  }

  async findById(id: string) {
    return this._model.findById(id).select('-password');
  }

  async findByIdWithPassword(id: string) {
    return this._model.findById(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  async updatePassword(id: string, hashedPassword: string) {
    return this._model.findByIdAndUpdate(id, { password: hashedPassword }, { new: true }).select('-password');
  }

  async emailExists(email: string): Promise<boolean> {
    const doc = await this._model.findOne({ email: email.toLowerCase() }).select('_id');
    return !!doc;
  }

  async count(): Promise<number> {
    return this._model.countDocuments();
  }
}
