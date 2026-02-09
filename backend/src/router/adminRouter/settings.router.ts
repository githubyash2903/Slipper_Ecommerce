import express from 'express';
import { getStoreSettings, updateStoreSettings } from '../../controller/admin/settings.controller';
import { authenticate } from '../../middleware/auth';

const router = express.Router();

router.get('/', getStoreSettings); // Public access (for Footer)
router.put('/', authenticate, updateStoreSettings); // Admin only

export default router;