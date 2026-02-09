import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';
import { Router } from 'express';
import { 
    getAllOrdersAdmin, 
    updateOrderStatus, 
    getOrderDetailsAdmin, 
} from '../../controller/admin/order.controller';

//  /api/v1/admin/order

const router = Router();


router.get('/all', authenticate, authorize(['ADMIN']), getAllOrdersAdmin);

router.get('/:id', authenticate, authorize(['ADMIN']), getOrderDetailsAdmin);

router.patch('/:id/status', authenticate, authorize(['ADMIN']), updateOrderStatus);

export default router;