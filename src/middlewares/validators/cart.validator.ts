import { validateRequest } from '.';
import { isMongoId, isGreaterThanZero } from '../../utils/validator.utils';
import { check } from 'express-validator';

export const addItemValidator = [
  isMongoId('variantId'),
  isGreaterThanZero({ key: 'qty' }),
  ...validateRequest,
];

export const updateItemQtyValidator = [
  check('qty')
    .notEmpty().withMessage('qty is required')
    .isInt({ min: 1, max: 10 }).withMessage('qty must be between 1 and 10'),
  ...validateRequest,
];
