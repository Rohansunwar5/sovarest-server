import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { adminSignup, adminLogin, adminProfile, adminChangePassword } from '../controllers/admin.auth.controller';
import { adminSignupValidator, adminLoginValidator, adminChangePasswordValidator } from '../middlewares/validators/admin.auth.validator';
import isAdmin from '../middlewares/isAdmin.middleware';
import bootstrapOrAdmin from '../middlewares/bootstrapOrAdmin.middleware';

const adminAuthRouter = Router();

// Free on first call (zero admins); requires an existing admin token thereafter
adminAuthRouter.post('/signup', asyncHandler(bootstrapOrAdmin), adminSignupValidator, asyncHandler(adminSignup));
adminAuthRouter.post('/login', adminLoginValidator, asyncHandler(adminLogin));
adminAuthRouter.get('/profile', isAdmin, asyncHandler(adminProfile));
adminAuthRouter.patch('/change-password', isAdmin, adminChangePasswordValidator, asyncHandler(adminChangePassword));

export default adminAuthRouter;