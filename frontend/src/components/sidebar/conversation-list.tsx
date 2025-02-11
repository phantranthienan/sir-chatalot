import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversationsQuery } from '@/hooks/react-query/conversations';
import { useAuthStore } from '@/stores/auth.store';

import avatarFallback from '@/assets/avatar.png';
import { useSocketStore } from '@/stores/socket.store';
import ConversationsSkeleton from '../skeletons/conversations.skeleton';

const ConversationList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: conversations, isLoading } = useConversationsQuery();
  const { onlineUsers } = useSocketStore();

  const handleClickConversation = (conversationId: string) => {
    navigate(`/${conversationId}`);
  };

  if (isLoading) return <ConversationsSkeleton />;

  return (
    <div className="w-full overflow-y-auto">
      {conversations?.map((conversation) => {
        const otherUser = conversation.participants.find(
          (participant) => participant._id !== user!._id
        );
        if (!otherUser) return null; // skip if for some reason not found

        return (
          <button
            key={conversation._id}
            onClick={() => handleClickConversation(conversation._id)}
            className={`hover:bg-base-300 flex w-full cursor-pointer items-center gap-3 p-3 transition-colors`}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={otherUser.avatarUrl || avatarFallback}
                alt={otherUser.username}
                className="h-12 w-12 rounded-full object-cover"
              />
              {onlineUsers.includes(otherUser._id) && (
                <span className="absolute right-0 bottom-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="hidden min-w-0 text-left lg:block">
              <div className="text-md text-base-content truncate font-medium">
                {otherUser.username}
              </div>
              <div className="text-base-content/50 truncate text-sm">
                {conversation.lastMessage?.sender._id === user!._id
                  ? `You: ${conversation.lastMessage.text}`
                  : conversation.lastMessage?.text || 'No message yet'}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
