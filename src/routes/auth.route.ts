import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import { authLimiter, strictLimiter } from '../middlewares/rate-limit.middleware';
import {
  deleteAccount,
  generateAccountDeletionCode,
  generateResetPasswordLink, genericLogin, profile, resendVerificationLink,
  resetPassword, signup, sso, updateProfile, uploadProfileImage, verifyEmail, verifyResetPasswordCode
} from '../controllers/auth.controller';
import {
  deleteAccountValidator,
  generateResetPasswordCodeValidator, loginValidator, resetPasswordValidator,
  signupValidator, ssoValidator, updateProfileValidator, verifyEmailValidator, verifyResetPasswordCodeValidator
} from '../middlewares/validators/auth.validator';
import isLoggedIn from '../middlewares/isLoggedIn.middleware';
import { upload } from '../utils/multer.util';

const authRouter = Router();

authRouter.post('/login', authLimiter, loginValidator, asyncHandler(genericLogin));
authRouter.post('/sso', authLimiter, ssoValidator, asyncHandler(sso));
authRouter.post('/signup', authLimiter, signupValidator, asyncHandler(signup));
authRouter.get('/profile', isLoggedIn, asyncHandler(profile));
authRouter.patch('/profile', isLoggedIn, updateProfileValidator, asyncHandler(updateProfile));
authRouter.put('/profile-image', isLoggedIn, upload.single('file'), asyncHandler(uploadProfileImage));
authRouter.post('/resend-verification-code', isLoggedIn, asyncHandler(resendVerificationLink));
authRouter.patch('/verify-email/:code', verifyEmailValidator, asyncHandler(verifyEmail));
authRouter.post('/reset-password', strictLimiter, generateResetPasswordCodeValidator, asyncHandler(generateResetPasswordLink));
authRouter.get('/reset-password/:code', strictLimiter, verifyResetPasswordCodeValidator, asyncHandler(verifyResetPasswordCode));
authRouter.patch('/reset-password/:code', strictLimiter, resetPasswordValidator, asyncHandler(resetPassword));
authRouter.post('/request-account-deletion', isLoggedIn, strictLimiter, asyncHandler(generateAccountDeletionCode));
authRouter.post('/delete-account', isLoggedIn, strictLimiter, deleteAccountValidator, asyncHandler(deleteAccount));

export default authRouter;