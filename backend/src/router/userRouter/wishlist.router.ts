import { Router } from 'express';
import * as controller from '../../controller/user/wishlist.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

// /api/v1/user/wishlist

router.use(authenticate , authorize(['USER']))

// 1. Get List
router.get('/', controller.getWishlist);

// 2. Add Item
router.post('/', controller.addItem);

// 3. Remove Item
router.delete('/:productId', controller.removeItem);

export default router;