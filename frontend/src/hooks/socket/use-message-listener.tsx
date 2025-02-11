import { useEffect } from 'react';
import { useSocketStore } from '@/stores/socket.store';
import { useQueryClient } from '@tanstack/react-query';
import { ConversationData, MessageData } from '@/types/api/common.types';

const useMessageListener = () => {
  const queryClient = useQueryClient();
  const { socket, activeConversationId } = useSocketStore();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: MessageData) => {
      const conversationId = newMessage.conversation;
      const senderId = newMessage.sender._id;

      queryClient.setQueryData(
        [conversationId, 'messages'],
        (oldMessages: MessageData[] | undefined) => {
          return oldMessages ? [...oldMessages, newMessage] : [newMessage];
        }
      );

      queryClient.setQueryData(
        ['conversations'],
        (oldConversations: ConversationData[] | undefined) => {
          if (!oldConversations) return oldConversations;
          const updatedConversations = oldConversations.map((conv) => {
            if (conv._id === conversationId) {
              // indentify the receiver
              const receiver = conv.participants.find(
                (participant) => participant._id !== senderId
              );

              // extract the unseen count for the receiver
              const currentCount = conv.unseenCount
                ? conv.unseenCount[receiver!._id] || 0
                : 0;

              // if the conversation is active, reset the unseen count
              const newUnseenCount =
                conversationId === activeConversationId ? 0 : currentCount + 1;

              return {
                ...conv,
                lastMessage: { ...newMessage, sender: newMessage.sender._id },
                updatedAt: newMessage.createdAt,
                unseenCount: {
                  ...conv.unseenCount,
                  [receiver!._id]: newUnseenCount,
                },
              };
            }
            return conv;
          });

          return updatedConversations.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
      );
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, queryClient, activeConversationId]);
};

export default useMessageListener;
