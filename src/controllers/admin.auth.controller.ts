import { NextFunction, Request, Response } from 'express';
import adminAuthService from '../services/admin.auth.service';

export const adminSignup = async (req: Request, _res: Response, next: NextFunction) => {
  const { firstName, lastName, email, password } = req.body;
  const response = await adminAuthService.signup({ firstName, lastName, email, password });

  next(response);
};

export const adminLogin = async (req: Request, _res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const response = await adminAuthService.login({ email, password });

  next(response);
};

export const adminProfile = async (req: Request, _res: Response, next: NextFunction) => {
  const { _id } = req.admin;
  const response = await adminAuthService.profile(_id);

  next(response);
};

export const adminChangePassword = async (req: Request, _res: Response, next: NextFunction) => {
  const { _id } = req.admin;
  const { currentPassword, newPassword } = req.body;
  const response = await adminAuthService.changePassword(_id, { currentPassword, newPassword });

  next(response);
};
