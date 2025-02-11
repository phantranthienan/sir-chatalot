// src/sockets/chat.handlers.ts
import { Server, Socket } from 'socket.io';
import { sendMessage } from '@/services/message.service';
import { getConversationById, resetUnseenCount } from '@/services/conversation.service';

export function registerChatHandlers(io: Server, socket: Socket) {
  const userId = socket.handshake.query.userId as string;

  socket.on('join_conversation', async (conversationId: string) => {
    try {
      socket.join(conversationId);
    } catch (error) {
      console.error('Error joining conversation:', error);
      socket.emit('error', { message: 'Failed to join conversation' });
    }
  });

  socket.on('messages_seen', async (conversationId: string) => {
    try {
      await resetUnseenCount(conversationId, userId);
      const updatedConversation = await getConversationById(conversationId);
  
      io.to(socket.id).emit('update_conversation', updatedConversation);
    } catch (error) {
      console.error('Error updating conversation:', error);
      socket.emit('error', { message: 'Failed to update conversation' });
    }
  });

  socket.on('typing', (conversationId: string) => {
    socket.to(conversationId).emit('user_typing', userId);
  });

  socket.on('stop_typing', (conversationId: string) => {
    socket.to(conversationId).emit('user_stop_typing', userId);
  });

  socket.on('send_message', async (data) => {
    const { conversationId, text, senderId } = data;
    
    try {
      const message = await sendMessage(conversationId, senderId, text);
      io.to(conversationId).emit('new_message', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('leave_conversation', (conversationId: string) => {
    socket.leave(conversationId);
  });
}
