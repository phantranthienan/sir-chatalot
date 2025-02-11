import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { useMessagesQuery } from '@/hooks/react-query/conversations';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketStore } from '@/stores/socket.store';

import MessagesSkeleton from '../skeletons/messages.skeleton';
import { useAuthStore } from '@/stores/auth.store';

import avatarFallback from '@/assets/avatar.png';
import { MessageData } from '@/types/api/common.types';

interface ChatBodyProps {
  conversationId: string;
}

const ChatBody: React.FC<ChatBodyProps> = ({ conversationId }) => {
  const { user } = useAuthStore();
  const { data: messages, isLoading } = useMessagesQuery(conversationId);
  const { socket } = useSocketStore();
  const queryClient = useQueryClient();

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: MessageData) => {
      if (newMessage.conversation === conversationId) {
        queryClient.setQueryData(
          [conversationId, 'messages'],
          (oldMessages: MessageData[] | undefined) => {
            return oldMessages ? [...oldMessages, newMessage] : [newMessage];
          }
        );
      }
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, conversationId, queryClient]);

  if (isLoading) return <MessagesSkeleton />;

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages?.map((message, index) => {
        // Format the current message's day and compare with previous message's day
        const currentDay = dayjs(message.createdAt).format('YYYY-MM-DD');
        const previousDay =
          index > 0
            ? dayjs(messages[index - 1].createdAt).format('YYYY-MM-DD')
            : null;
        // Show divider if it's the first message or if the day changed
        const showDivider = index === 0 || currentDay !== previousDay;
        // If today's date, display "Today", otherwise format the date
        const dividerText =
          currentDay === dayjs().format('YYYY-MM-DD')
            ? 'Today'
            : dayjs(message.createdAt).format('MMM D, YYYY');

        return (
          <React.Fragment key={message._id}>
            {showDivider && (
              <div className="divider text-primary-content/50 text-sm">
                {dividerText}
              </div>
            )}
            <div
              className={twMerge(
                'chat',
                message.sender._id === user?._id ? 'chat-end' : 'chat-start'
              )}
            >
              <div className="chat-image avatar">
                <div className="h-12 w-12 rounded-full border">
                  <img
                    src={
                      message.sender._id === user?._id
                        ? user.avatarUrl || avatarFallback
                        : message.sender.avatarUrl || avatarFallback
                    }
                    alt={
                      message.sender._id === user?._id
                        ? user.username
                        : message.sender.username
                    }
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
              <div
                className={twMerge(
                  'chat-bubble rounded-2xl p-2',
                  message.sender._id === user?._id
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-200'
                )}
              >
                <p>{message.text}</p>
              </div>
              <div className="chat-header">
                <time className="text-xs opacity-50">
                  {dayjs(message.createdAt).format('HH:mm')}
                </time>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
};

export default ChatBody;
