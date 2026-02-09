import { Router } from 'express';
import * as controller from '../../controller/admin/employee.controller';

const router = Router();

//  /api/v1/admin/employees

router.get('/', controller.getEmployees);
router.post('/', controller.addEmployee);
router.put('/:id', controller.updateEmployee);
router.patch('/:id/status', controller.toggleEmployeeStatus);
router.delete('/:id', controller.deleteEmployee);

export default router;