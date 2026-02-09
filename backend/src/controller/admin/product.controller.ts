import { Request, Response, NextFunction } from 'express';
import * as service from '../../service/product.service'; 
import { success } from '../../utils/response';

// Create prouduct
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.createProduct(req.body);
    return success(res, product, 'Product created successfully');
  } catch (e) {
    next(e);
  }
}

// Get all products
export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await service.getAllProducts();
    return success(res, products);
  } catch (e) {
    next(e);
  }
}


// Get single product
export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.getProductById(req.params.id);
    return success(res, product);
  } catch (e) {
    next(e);
  }
}

// Update product
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await service.updateProduct(req.params.id, req.body);
    return success(res, product, 'Product updated successfully');
  } catch (e) {
    next(e);
  }
}

// Delete product
export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteProduct(req.params.id);
    return success(res, null, 'Product deleted successfully');
  } catch (e) {
    next(e);
  }
}