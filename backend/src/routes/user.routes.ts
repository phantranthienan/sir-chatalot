import { getUserProfileController, updateAvatarController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { upload } from '@/middlewares/upload.middleware';
import express from 'express';

const router = express.Router();

router.get('/me', authMiddleware, getUserProfileController);

router.put('/me/avatar', authMiddleware, upload.single('avatar'), updateAvatarController);


export default router;
