import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { adminLogin, adminProfile, adminChangePassword } from '../controllers/admin.auth.controller';
import { adminLoginValidator, adminChangePasswordValidator } from '../middlewares/validators/admin.auth.validator';
import isAdmin from '../middlewares/isAdmin.middleware';

const adminAuthRouter = Router();

adminAuthRouter.post('/login', adminLoginValidator, asyncHandler(adminLogin));
adminAuthRouter.get('/profile', isAdmin, asyncHandler(adminProfile));
adminAuthRouter.patch('/change-password', isAdmin, adminChangePasswordValidator, asyncHandler(adminChangePassword));

export default adminAuthRouter;
