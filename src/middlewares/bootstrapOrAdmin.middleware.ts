import { Request, Response, NextFunction } from 'express';
import { AdminRepository } from '../repository/admin.repository';
import isAdmin from './isAdmin.middleware';

const adminRepository = new AdminRepository();

// Allows unauthenticated access only when zero admins exist (first-time bootstrap).
// Once any admin is created all subsequent calls must carry a valid admin token.
const bootstrapOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const adminCount = await adminRepository.count();
  if (adminCount === 0) return next();
  return isAdmin[0](req, res, () => isAdmin[1](req, res, next));
};

export default bootstrapOrAdmin;
