import { check } from 'express-validator';
import { validateRequest } from '.';

export const addAddressValidator = [
  check('fullName').notEmpty().withMessage('Full name is required'),
  check('phone')
    .notEmpty().withMessage('Phone is required')
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian phone number'),
  check('line1').notEmpty().withMessage('Address line 1 is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('state').notEmpty().withMessage('State is required'),
  check('pincode')
    .notEmpty().withMessage('Pincode is required')
    .matches(/^\d{6}$/).withMessage('Enter a valid 6-digit pincode'),
  ...validateRequest,
];

export const updateAddressValidator = [
  check('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/).withMessage('Enter a valid 10-digit Indian phone number'),
  check('pincode')
    .optional()
    .matches(/^\d{6}$/).withMessage('Enter a valid 6-digit pincode'),
  ...validateRequest,
];

export const wishlistProductValidator = [
  check('productId').notEmpty().isMongoId().withMessage('Valid productId is required'),
  ...validateRequest,
];
