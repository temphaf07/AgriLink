import { Router } from 'express'; import { chat, recommendations } from './ai.controller.js'; import { protect } from '../middleware/auth.js';
const router = Router(); router.use(protect); router.post('/chat', chat); router.get('/recommendations', recommendations); export default router;
