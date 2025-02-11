export interface UserData {
  _id: string;
  email: string;
  username: string;
  avatarUrl: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface MessageData {
  _id: string;
  sender: UserData;
  text: string;
  conversation: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationData {
  _id: string;
  participants: UserData[];
  lastMessage: MessageData;
  createdAt: Date;
  updatedAt: Date;
}
