import { Request, Response, NextFunction } from 'express';
import * as service from '../../service/product.service';
import { success } from '../../utils/response';

export async function getPublicProducts(req: Request, res: Response, next: NextFunction) {
  try {
   
    const products = await service.getAllProducts();
    
    const activeProducts = products.filter((p: any) => p.is_active);
    
    return success(res, activeProducts);
  } catch (e) {
    next(e);
  }
}

export async function getProductDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await service.getProductById(req.params.id);
      return success(res, product);
    } catch (e) {
      next(e);
    }
}