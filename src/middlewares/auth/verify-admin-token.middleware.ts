import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../../errors/bad-request.error';
import { UnauthorizedError } from '../../errors/unauthorized.error';
import adminAuthService from '../../services/admin.auth.service';
import { decode, encode, encryptionKey } from '../../services/crypto.service';
import config from '../../config';

const verifyAdminToken = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new BadRequestError('Authorization header is missing');

    const token = authHeader.split(' ')[1];
    if (!token) throw new BadRequestError('Token is missing or invalid');

    const adminId = await adminAuthService.verifyTokenAndGetId(token);

    const key = await encryptionKey(config.JWT_CACHE_ENCRYPTION_KEY);
    const cached = await adminAuthService.getCachedToken(adminId);

    if (!cached) {
      await adminAuthService.setCachedToken(adminId, await encode(token, key));
    } else {
      const decoded = await decode(cached, key);
      if (decoded !== token) throw new UnauthorizedError('Session expired');
    }

    req.admin = { _id: adminId };
    next();
  } catch {
    next();
  }
};

export default verifyAdminToken;
