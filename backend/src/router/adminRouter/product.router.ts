import { Router } from 'express';
import * as controller from '../../controller/admin/product.controller';
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate, authorize(['ADMIN']));

//  /api/v1/admin/product


router.post('/', controller.create);      
router.get('/', controller.list);          
router.get('/:id', controller.getOne);    
router.patch('/:id', controller.update);   
router.delete('/:id', controller.remove); 

export default router;