import { Router } from 'express';
import * as controller from '../../controller/admin/stock.controller';

const router = Router();

//  /api/v1/admin/stock

router.get('/dashboard', controller.getStockDashboard); 
router.post('/assign', controller.assignStock); 
router.post('/sale', controller.recordSale); 

export default router;