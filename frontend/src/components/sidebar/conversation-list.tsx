import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConversationsQuery } from '@/hooks/react-query/conversations';
import { useAuthStore } from '@/stores/auth.store';
import { useSocketStore } from '@/stores/socket.store';

import avatarFallback from '@/assets/avatar.png';
import ConversationsSkeleton from '../skeletons/conversations.skeleton';
import dayjs from 'dayjs';

const ConversationList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: conversations, isLoading } = useConversationsQuery();
  const { onlineUsers, joinConversation } = useSocketStore();

  const handleClickConversation = (conversationId: string) => {
    navigate(`/${conversationId}`);
  };

  useEffect(() => {
    if (conversations) {
      conversations.forEach((conv) => {
        joinConversation(conv._id);
      });
    }
  }, [conversations, joinConversation]);

  if (isLoading) return <ConversationsSkeleton />;

  return (
    <div className="w-full overflow-y-auto">
      {conversations?.map((conversation) => {
        const otherUser = conversation.participants.find(
          (participant) => participant._id !== user!._id
        );
        if (!otherUser) return null; // skip if for some reason not found

        const unseenCount = conversation.unseenCount
          ? conversation.unseenCount[user!._id]
          : 0;

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
                <span className="ring-base-100 absolute right-0 bottom-0 size-2.5 rounded-full bg-green-500 ring-2" />
              )}
              {unseenCount > 0 && (
                <div className="badge badge-primary badge-sm ring-base-100 absolute -top-1 -right-1 flex size-5 rounded-full ring-2 lg:hidden">
                  {unseenCount}
                </div>
              )}
            </div>

            <div className="hidden w-full min-w-0 text-left lg:block">
              <div className="text-md text-base-content truncate font-medium">
                {otherUser.username}
              </div>
              <div className="text-base-content/50 truncate text-sm">
                {conversation.lastMessage?.sender === user!._id
                  ? `You: ${conversation.lastMessage.text}`
                  : conversation.lastMessage?.text || 'No message yet'}
              </div>
              <div className="text-base-content/50 text-xs">
                {conversation.lastMessage &&
                  dayjs(conversation.lastMessage.createdAt).format(
                    'MMM D, YYYY h:mm A'
                  )}
              </div>
            </div>

            {unseenCount > 0 && (
              <div className="badge badge-primary badge-sm ml-auto hidden rounded-md lg:block">
                {unseenCount}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ConversationList;
