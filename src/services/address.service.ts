import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { AddressRepository, ICreateAddressParams } from '../repository/address.repository';

const MAX_ADDRESSES = 5;

class AddressService {
  constructor(private readonly _addressRepository: AddressRepository) {}

  async listAddresses(userId: string) {
    return this._addressRepository.findByUserId(userId);
  }

  async addAddress(userId: string, params: Omit<ICreateAddressParams, 'userId'>) {
    const count = await this._addressRepository.countByUserId(userId);
    if (count >= MAX_ADDRESSES)
      throw new BadRequestError(`You can save a maximum of ${MAX_ADDRESSES} addresses`);

    const isFirst = count === 0;
    return this._addressRepository.create({ ...params, userId }, isFirst);
  }

  async updateAddress(userId: string, addressId: string, params: Partial<Omit<ICreateAddressParams, 'userId'>>) {
    const address = await this._addressRepository.findById(addressId);
    if (!address) throw new NotFoundError('Address not found');
    if (address.userId.toString() !== userId) throw new UnauthorizedError('Access denied');

    return this._addressRepository.update(addressId, params);
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this._addressRepository.findById(addressId);
    if (!address) throw new NotFoundError('Address not found');
    if (address.userId.toString() !== userId) throw new UnauthorizedError('Access denied');

    const wasDefault = address.isDefault;
    await this._addressRepository.delete(addressId);

    if (wasDefault) {
      const remaining = await this._addressRepository.findByUserId(userId);
      if (remaining.length > 0) {
        await this._addressRepository.clearDefault(userId);
        await this._addressRepository.setDefault(remaining[0]._id.toString());
      }
    }

    return true;
  }

  async setDefault(userId: string, addressId: string) {
    const address = await this._addressRepository.findById(addressId);
    if (!address) throw new NotFoundError('Address not found');
    if (address.userId.toString() !== userId) throw new UnauthorizedError('Access denied');

    await this._addressRepository.clearDefault(userId);
    return this._addressRepository.setDefault(addressId);
  }
}

export default new AddressService(new AddressRepository());
