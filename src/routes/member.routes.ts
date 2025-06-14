import { Router } from 'express';
import { getMembers, getMemberById, updateMember, deleteMember } from '../controllers/member.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware); // ต้อง login ก่อนถึงจะเข้าได้
router.get('/', getMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
