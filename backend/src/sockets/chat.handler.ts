// src/sockets/chat.handlers.ts
import { Server, Socket } from 'socket.io';
import { sendMessage } from '@/services/message.service';

export function registerChatHandlers(io: Server, socket: Socket) {
  // Allow a socket to join a conversation (room)
  socket.on('join_conversation', (conversationId: string) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });

  // When a user sends a message, call the service and then broadcast it
  socket.on('send_message', async (data) => {
    const { conversationId, text, senderId } = data;
    
    try {
      const message = await sendMessage(conversationId, senderId, text);
      // Emit the new message to everyone in the conversation
      io.to(conversationId).emit('new_message', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('leave_conversation', (conversationId: string) => {
    socket.leave(conversationId);
    console.log(`Socket ${socket.id} left conversation ${conversationId}`);
  });
}
