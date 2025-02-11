import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useConversationDetailsQuery } from '@/hooks/react-query/conversations';

import { useAuthStore } from '@/stores/auth.store';
import { useSocketStore } from '@/stores/socket.store';

import ChatHeader from '@/components/chat/chat-header';
import ChatBody from '@/components/chat/chat-body';
import MessageInput from '@/components/chat/message-input';

const ConversationPage: React.FC = () => {
  const { conversationId } = useParams();
  const { user } = useAuthStore();
  const { onlineUsers, joinConversation, socket } = useSocketStore();

  // join the conversation room
  useEffect(() => {
    if (socket && conversationId) {
      joinConversation(conversationId);
    }
  }, [conversationId, joinConversation, socket]);

  // Fetch conversation details
  const { data: conversation } = useConversationDetailsQuery(conversationId!);

  // determine the other user in the conversation
  const otherUser = conversation?.participants.find(
    (participant) => participant._id !== user!._id
  );

  if (!otherUser) return null; // skip if for some reason not found

  const isOnline = onlineUsers.includes(otherUser._id);

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader
        username={otherUser.username}
        isOnline={isOnline}
        avatarUrl={otherUser.avatarUrl}
      />

      <ChatBody conversationId={conversationId!} />

      <MessageInput conversationId={conversationId!} />
    </div>
  );
};

export default ConversationPage;
