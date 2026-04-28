import { validateRequest } from '.';
import { isRequired } from '../../utils/validator.utils';
import { check } from 'express-validator';

export const adminSignupValidator = [
  check('firstName').notEmpty().withMessage('firstName is required').trim(),
  check('lastName').optional().trim(),
  check('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
  check('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters'),
  ...validateRequest,
];

export const adminLoginValidator = [
  isRequired('email'),
  isRequired('password'),
  ...validateRequest,
];

export const adminChangePasswordValidator = [
  isRequired('currentPassword'),
  check('newPassword')
    .notEmpty().withMessage('newPassword is required')
    .isLength({ min: 8 }).withMessage('newPassword must be at least 8 characters'),
  ...validateRequest,
];
