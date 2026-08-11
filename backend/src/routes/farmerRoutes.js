import { Router } from 'express';
import { storefront } from '../controllers/farmerController.js';
const router = Router();
router.get('/:id', storefront);
export default router;
