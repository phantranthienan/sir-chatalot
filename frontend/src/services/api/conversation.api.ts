import axios from '@/services/api/axios.config';

import {
  GetConversationDetailsResponseData,
  GetConversationsResponseData,
  GetMessagesResponseData,
} from '@/types/api/responses/conversation.responses';
import { ApiResponse } from '@/types/api/responses/response.type';

export const getConversations = async (): Promise<
  ApiResponse<GetConversationsResponseData>
> => {
  const response =
    await axios.get<ApiResponse<GetConversationsResponseData>>(
      '/conversations'
    );
  return response.data;
};

export const getConversationDetails = async (
  conversationId: string
): Promise<ApiResponse<GetConversationDetailsResponseData>> => {
  const response = await axios.get<
    ApiResponse<GetConversationDetailsResponseData>
  >(`/conversations/${conversationId}`);
  return response.data;
};

export const initiateConversation = async ({
  username,
}: {
  username: string;
}) => {
  const response = await axios.post('/conversations', { username });
  return response.data;
};

export const getMessages = async (
  conversationId: string
): Promise<ApiResponse<GetMessagesResponseData>> => {
  const response = await axios.get<ApiResponse<GetMessagesResponseData>>(
    `/conversations/${conversationId}/messages`
  );
  return response.data;
};

export const sendMessage = async ({
  conversationId,
  message,
}: {
  conversationId: string;
  message: string;
}) => {
  const response = await axios.post(
    `/conversations/${conversationId}/messages`,
    {
      message,
    }
  );
  return response.data;
};
