import { Router } from 'express';
import { 
    placeOrder,  
    getUserOrders,
    verifyPayment,
    createOrder
} from '../../controller/user/order.controller';

import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const router = Router();
router.use(authenticate, authorize(['USER']));

router.post('/' , placeOrder );
router.get('/', getUserOrders);

// RAZORPAY ROUTES 
router.post('/razorpay', createOrder);
router.post('/verify', verifyPayment);

export default router;