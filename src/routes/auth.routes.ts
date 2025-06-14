import { Router } from 'express';
import { registerMember, loginMember, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerMember);
router.post('/login', loginMember);
router.get('/me', authMiddleware, getMe);

export default router;
