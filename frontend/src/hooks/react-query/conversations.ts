// src/hooks/react-query/conversations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  initiateConversation,
  getMessages,
  sendMessage,
  getConversationDetails,
} from '@/services/api/conversation.api'; // adjust the import path if needed
import useNotification from '../use-notification';

// Define constant query keys for conversations
export const QUERY_KEYS = {
  conversations: ['conversations'],
  messages: (conversationId: string) => [conversationId, 'messages'],
};

// Hook for fetching conversations list
export const useConversationsQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.conversations,
    queryFn: async () => {
      const response = await getConversations();
      return response.data?.conversations;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useConversationDetailsQuery = (conversationId: string) => {
  return useQuery({
    queryKey: [conversationId],
    queryFn: async () => {
      const response = await getConversationDetails(conversationId);
      return response.data?.conversation;
    },
    enabled: Boolean(conversationId),
  });
};

// Hook for initiating a new conversation
export const useInitiateConversationMutation = () => {
  const queryClient = useQueryClient();
  const { handleSuccess, handleError } = useNotification();
  return useMutation({
    mutationFn: initiateConversation,
    onSuccess: (data) => {
      // Invalidate conversations query to refetch list
      handleSuccess(data.message);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

// Hook for fetching messages for a given conversation
export const useMessagesQuery = (conversationId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.messages(conversationId),
    queryFn: async () => {
      const response = await getMessages(conversationId);
      return response.data?.messages;
    },
    staleTime: 5 * 60 * 1000, // Cache messages for 5 minutes
    enabled: Boolean(conversationId), // Only run if conversationId exists
  });
};

// Hook for sending a message in a given conversation
export const useSendMessageMutation = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ message }: { message: string }) =>
      sendMessage({ conversationId, message }),
    onSuccess: () => {
      // Invalidate messages query to fetch updated messages list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(conversationId),
      });
    },
  });
};
