import { Router } from 'express';
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;