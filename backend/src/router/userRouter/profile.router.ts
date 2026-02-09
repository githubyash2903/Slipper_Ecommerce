import { Router } from 'express';
import { authenticate } from '../../middleware/auth'; 
import * as controller from '../../controller/user/profile.controller';
import { authorize } from '../../middleware/authorize';
const router = Router();

router.use(authenticate , authorize(['USER']))

//  PROFILE ROUTES
router.get('/', controller.getProfile);       
router.put('/', controller.updateProfile);    

//  ADDRESS ROUTES
router.get('/addresses', controller.getAddresses);       
router.post('/addresses', controller.addAddress);        
router.delete('/addresses/:id', controller.deleteAddress); 


export default router;