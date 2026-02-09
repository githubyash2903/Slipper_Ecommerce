import { Router } from 'express';
import { authenticate } from '../../middleware/auth'; 
import { addToCart, clearCart, getCart, removeFromCart, updateCartItem } from '../../controller/user/cart.controller';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.use(authenticate , authorize(['USER']))

router.get('/', getCart);
router.post('/', addToCart);
router.patch('/:id', updateCartItem);
router.delete('/clear', clearCart);
router.delete('/:id', removeFromCart);

export default router;