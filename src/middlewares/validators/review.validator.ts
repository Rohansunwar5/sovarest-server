import { check } from 'express-validator';
import { validateRequest } from '.';

export const createReviewValidator = [
  check('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title must be 120 characters or fewer'),
  check('body')
    .optional()
    .isLength({ max: 2000 }).withMessage('Review body must be 2000 characters or fewer'),
  check('images')
    .optional()
    .isArray({ max: 5 }).withMessage('You can upload up to 5 images'),
  check('images.*')
    .optional()
    .isURL().withMessage('Each image must be a valid URL'),
  ...validateRequest,
];

export const createAdminReviewValidator = [
  check('productId')
    .notEmpty().withMessage('Product is required')
    .isMongoId().withMessage('Invalid product ID'),
  check('reviewerName')
    .notEmpty().withMessage('Reviewer name is required')
    .isLength({ max: 100 }).withMessage('Reviewer name must be 100 characters or fewer'),
  check('userId')
    .optional({ nullable: true })
    .isMongoId().withMessage('Invalid user ID'),
  check('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  check('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 120 }).withMessage('Title must be 120 characters or fewer'),
  check('body')
    .optional()
    .isLength({ max: 2000 }).withMessage('Review body must be 2000 characters or fewer'),
  check('images')
    .optional()
    .isArray({ max: 5 }).withMessage('You can upload up to 5 images'),
  check('images.*')
    .optional()
    .isURL().withMessage('Each image must be a valid URL'),
  ...validateRequest,
];
