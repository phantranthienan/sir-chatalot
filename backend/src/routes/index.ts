import { Router } from 'express';
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import conversationRoutes from '@/routes/conversation.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/conversations', conversationRoutes);

export default router;