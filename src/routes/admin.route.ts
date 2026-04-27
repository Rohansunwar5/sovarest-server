import { Router } from 'express';
import { asyncHandler } from '../utils/asynchandler';
import isAdmin from '../middlewares/isAdmin.middleware';
import { upload } from '../utils/multer.util';
import adminAuthRouter from './admin.auth.route';
import {
  createAttribute,
  updateAttribute,
  addAttributeValue,
  updateAttributeValue,
  removeAttributeValue,
  listAttributesAdmin,
  createCategory,
  updateCategory,
  listCategoriesAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductAdmin,
  listProductsAdmin,
  createVariant,
  bulkCreateVariants,
  updateVariant,
  adjustVariantStock,
  deleteVariant,
  getLowStockVariants,
  uploadImage,
} from '../controllers/admin.catalog.controller';
import {
  createAttributeValidator,
  addAttributeValueValidator,
  updateAttributeValueValidator,
  createCategoryValidator,
  updateCategoryValidator,
  createProductValidator,
  updateProductValidator,
  createVariantValidator,
  bulkCreateVariantsValidator,
  updateVariantValidator,
  adjustStockValidator,
} from '../middlewares/validators/catalog.validator';

const adminRouter = Router();

// Auth routes — public (login) and protected (profile, change-password) handled inside adminAuthRouter
adminRouter.use('/auth', adminAuthRouter);

// All routes below require a valid admin session
adminRouter.use(isAdmin);

// ── Image Upload ──────────────────────────────────────────────────────────────
adminRouter.post('/upload/image', upload.single('file'), asyncHandler(uploadImage));

// ── Attributes ────────────────────────────────────────────────────────────────
adminRouter.get('/attributes', asyncHandler(listAttributesAdmin));
adminRouter.post('/attributes', createAttributeValidator, asyncHandler(createAttribute));
adminRouter.patch('/attributes/:id', asyncHandler(updateAttribute));
adminRouter.post('/attributes/:id/values', addAttributeValueValidator, asyncHandler(addAttributeValue));
adminRouter.patch('/attributes/:id/values/:valueId', updateAttributeValueValidator, asyncHandler(updateAttributeValue));
adminRouter.delete('/attributes/:id/values/:valueId', asyncHandler(removeAttributeValue));

// ── Categories ────────────────────────────────────────────────────────────────
adminRouter.get('/categories', asyncHandler(listCategoriesAdmin));
adminRouter.post('/categories', createCategoryValidator, asyncHandler(createCategory));
adminRouter.patch('/categories/:id', updateCategoryValidator, asyncHandler(updateCategory));

// ── Products ─────────────────────────────────────────────────────────────────
adminRouter.get('/products', asyncHandler(listProductsAdmin));
adminRouter.post('/products', createProductValidator, asyncHandler(createProduct));
adminRouter.get('/products/:slug', asyncHandler(getProductAdmin));
adminRouter.patch('/products/:id', updateProductValidator, asyncHandler(updateProduct));
adminRouter.delete('/products/:id', asyncHandler(deleteProduct));

// ── Variants ─────────────────────────────────────────────────────────────────
adminRouter.post('/products/:id/variants', createVariantValidator, asyncHandler(createVariant));
adminRouter.post('/products/:id/variants/bulk', bulkCreateVariantsValidator, asyncHandler(bulkCreateVariants));
adminRouter.patch('/variants/:id', updateVariantValidator, asyncHandler(updateVariant));
adminRouter.patch('/variants/:id/stock', adjustStockValidator, asyncHandler(adjustVariantStock));
adminRouter.delete('/variants/:id', asyncHandler(deleteVariant));

// ── Inventory ─────────────────────────────────────────────────────────────────
adminRouter.get('/inventory/low-stock', asyncHandler(getLowStockVariants));

export default adminRouter;
