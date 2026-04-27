import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../errors/unauthorized.error';

const requireAdminAuth = (_req: Request, _res: Response, next: NextFunction) => {
  if (!_req.admin?._id) throw new UnauthorizedError('Admin authentication required');
  next();
};

export default requireAdminAuth;
