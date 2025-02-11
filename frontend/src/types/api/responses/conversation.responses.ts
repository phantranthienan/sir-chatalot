import { ConversationData, MessageData } from '../common.types';

export interface GetConversationsResponseData {
  conversations: ConversationData[];
}

export interface GetConversationDetailsResponseData {
  conversation: ConversationData;
}

export interface GetMessagesResponseData {
  messages: MessageData[];
}
