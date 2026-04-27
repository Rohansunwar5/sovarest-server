import { NextFunction, Request, Response } from 'express';
import categoryService from '../services/catalog/category.service';
import attributeService from '../services/catalog/attribute.service';
import productService from '../services/catalog/product.service';

export const listCategories = async (_req: Request, _res: Response, next: NextFunction) => {
  const response = await categoryService.listCategories();
  next(response);
};

export const listAttributes = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await attributeService.listAttributes();
  next(response);
};

export const listProducts = async (req: Request, _res: Response, next: NextFunction) => {
  const response = await productService.listProducts(req.query as Record<string, unknown>);
  next(response);
};

export const getFeaturedProducts = async (_req: Request, _res: Response, next: NextFunction) => {
  const response = await productService.getFeaturedProducts();
  next(response);
};

export const getBestsellers = async (_req: Request, _res: Response, next: NextFunction) => {
  const response = await productService.getBestsellers();
  next(response);
};

export const getProductBySlug = async (req: Request, _res: Response, next: NextFunction) => {
  const { slug } = req.params;
  const response = await productService.getProductBySlug(slug);
  next(response);
};
