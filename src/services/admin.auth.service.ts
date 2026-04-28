import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import { BadRequestError } from '../errors/bad-request.error';
import { NotFoundError } from '../errors/not-found.error';
import { UnauthorizedError } from '../errors/unauthorized.error';
import { ForbiddenError } from '../errors/forbidden.error';
import { InternalServerError } from '../errors/internal-server.error';
import { AdminRepository } from '../repository/admin.repository';
import { adminJWTCacheManager } from './cache/entities';
import { encode, encryptionKey } from './crypto.service';

interface IAdminJWTPayload {
  _id: string;
}

class AdminAuthService {
  constructor(private readonly _adminRepository: AdminRepository) {}

  async signup(params: { firstName: string; lastName?: string; email: string; password: string }) {
    const exists = await this._adminRepository.emailExists(params.email);
    if (exists) throw new BadRequestError('An admin with this email already exists');

    const hashed = await bcrypt.hash(params.password, 10);
    const admin = await this._adminRepository.create({ ...params, password: hashed });

    const accessToken = await this._generateToken(admin._id.toString());
    return { accessToken };
  }

  async login(params: { email: string; password: string }) {
    const { email, password } = params;

    const admin = await this._adminRepository.findByEmail(email);
    if (!admin) throw new UnauthorizedError('Invalid credentials');
    if (!admin.isActive) throw new ForbiddenError('Account is deactivated');

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const accessToken = await this._generateToken(admin._id.toString());
    await this._adminRepository.updateLastLogin(admin._id.toString());

    return { accessToken };
  }

  async profile(adminId: string) {
    const admin = await this._adminRepository.findById(adminId);
    if (!admin) throw new NotFoundError('Admin not found');
    return admin;
  }

  async changePassword(adminId: string, params: { currentPassword: string; newPassword: string }) {
    const { currentPassword, newPassword } = params;

    const admin = await this._adminRepository.findByIdWithPassword(adminId);
    if (!admin) throw new NotFoundError('Admin not found');

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) throw new BadRequestError('Current password is incorrect');

    if (currentPassword === newPassword) throw new BadRequestError('New password must differ from current');

    const hashed = await bcrypt.hash(newPassword, 10);
    const updated = await this._adminRepository.updatePassword(adminId, hashed);
    if (!updated) throw new InternalServerError('Failed to update password');

    await adminJWTCacheManager.remove({ adminId });
    return true;
  }

  async verifyTokenAndGetId(token: string): Promise<string> {
    const payload = jwt.verify(token, config.ADMIN_JWT_SECRET) as IAdminJWTPayload;
    return payload._id;
  }

  async getCachedToken(adminId: string) {
    return adminJWTCacheManager.get({ adminId });
  }

  async setCachedToken(adminId: string, encryptedToken: unknown) {
    await adminJWTCacheManager.set({ adminId }, encryptedToken as { iv: string; encryptedData: string });
  }

  private async _generateToken(adminId: string): Promise<string> {
    const token = jwt.sign({ _id: adminId }, config.ADMIN_JWT_SECRET, { expiresIn: '24h' });

    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const encrypted = await encode(token, key);
    await adminJWTCacheManager.set({ adminId }, encrypted);

    return token;
  }
}

export default new AdminAuthService(new AdminRepository());
