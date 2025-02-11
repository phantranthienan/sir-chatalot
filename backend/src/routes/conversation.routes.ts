import express from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import {
  initiateConversationController,
  getConversationsController,
  sendMessageController,
  getMessagesController,
  getConversationDetailsController,
} from '@/controllers/conversation.controller';

const router = express.Router();

// Initiate a conversation with another user
router.post('/', authMiddleware, initiateConversationController);

// Get all conversations for the logged-in user
router.get('/', authMiddleware, getConversationsController);

// Get details for a specific conversation
router.get('/:conversationId', authMiddleware, getConversationDetailsController);

// Get messages for a specific conversation
router.get('/:conversationId/messages', authMiddleware, getMessagesController);

// Send a message in a conversation
router.post('/:conversationId/message', authMiddleware, sendMessageController);

export default router;
