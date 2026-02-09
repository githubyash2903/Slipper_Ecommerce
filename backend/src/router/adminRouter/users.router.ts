import { Router } from 'express';
import * as controller from '../../controller/admin/users.controller'; 
import { authenticate } from '../../middleware/auth';
import { authorize } from '../../middleware/authorize';

const userRouter = Router();

userRouter.use(authenticate, authorize(['ADMIN']));


userRouter.get('/', controller.list);               
userRouter.get('/:id', controller.getById); 

userRouter.patch('/:id/deactivate', controller.deactivate); 

export default userRouter;