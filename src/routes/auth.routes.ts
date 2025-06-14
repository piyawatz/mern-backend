import { Router } from 'express';
import { registerMember, loginMember } from '../controllers/auth.controller';

const router = Router();

router.post('/register', registerMember);
router.post('/login', loginMember);

export default router;
