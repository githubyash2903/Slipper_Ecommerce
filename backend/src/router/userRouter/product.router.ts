import { Router } from 'express';
import * as controller from '../../controller/user/product.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();



router.get('/', controller.getPublicProducts);
router.get('/:id', controller.getProductDetails);

export default router;