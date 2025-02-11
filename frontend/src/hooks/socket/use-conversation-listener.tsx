import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocketStore } from '@/stores/socket.store';
import { ConversationData } from '@/types/api/common.types';

const useConversationListener = () => {
  const { socket } = useSocketStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleSeenConversation = (updatedConversation: ConversationData) => {
      // Update the conversation list cache:
      queryClient.setQueryData(
        ['conversations'],
        (oldConversations: ConversationData[] | undefined) => {
          if (!oldConversations) return oldConversations;
          return oldConversations.map((conv) => {
            if (conv._id === updatedConversation._id) {
              return updatedConversation;
            }
            return conv;
          });
        }
      );
    };

    const handleNewConversation = () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    };

    socket.on('update_conversation', handleSeenConversation);
    socket.on('new_conversation', handleNewConversation);

    return () => {
      socket.off('update_conversation', handleSeenConversation);
      socket.off('new_conversation', handleNewConversation);
    };
  }, [socket, queryClient]);
};

export default useConversationListener;
