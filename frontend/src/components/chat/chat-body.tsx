import React, { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import { useMessagesQuery } from '@/hooks/react-query/conversations';

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

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isLoading) return <MessagesSkeleton />;

  const getDividerInfo = (
    messages: MessageData[],
    message: MessageData,
    index: number
  ) => {
    const currentDay = dayjs(message.createdAt).format('YYYY-MM-DD');
    const previousDay =
      index > 0
        ? dayjs(messages[index - 1].createdAt).format('YYYY-MM-DD')
        : null;
    // show divider if it's the first message or if the current day is different from the previous day
    const showDivider = index === 0 || currentDay !== previousDay;
    // if today, show "Today" instead of the date
    const dividerText =
      currentDay === dayjs().format('YYYY-MM-DD')
        ? 'Today'
        : dayjs(message.createdAt).format('MMM D, YYYY');
    return { showDivider, dividerText };
  };

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages?.map((message, index) => {
        const { showDivider, dividerText } = getDividerInfo(
          messages,
          message,
          index
        );

        return (
          <React.Fragment key={message._id}>
            {showDivider && (
              <div className="divider text-sm">{dividerText}</div>
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
                  'chat-bubble rounded-2xl',
                  message.sender._id === user?._id
                    ? 'bg-primary text-primary-content'
                    : 'bg-base-200'
                )}
              >
                <p>{message.text}</p>
              </div>
              <div className="chat-header">
                <time className="text-base-content/50 text-xs">
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
