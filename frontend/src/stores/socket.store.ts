import { Socket, io } from 'socket.io-client';
import { useAuthStore } from './auth.store';
import { create } from 'zustand';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

interface SocketStates {
  socket: Socket | null;
  activeConversationId: string | null;
  isConnected: boolean;
  onlineUsers: string[];
  joinedConversations: Set<string>;
}

interface SocketActions {
  connect: () => void;
  disconnect: () => void;
  setSocket: (socket: Socket) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  emitTyping: (conversationId: string) => void;
  emitStopTyping: (conversationId: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  setOnlineUsers: (users: string[]) => void;
  setActiveConversationId: (conversationId: string | null) => void;
}

export const useSocketStore = create<SocketStates & SocketActions>(
  (set, get) => ({
    socket: null,
    isConnected: false,
    onlineUsers: [],
    activeConversationId: null,
    joinedConversations: new Set(),

    connect: () => {
      const socket = io(SOCKET_URL, {
        autoConnect: false,
        query: {
          userId: useAuthStore.getState().user?._id,
        },
      });

      socket.on('connect', () => {
        set({ isConnected: true });
      });

      socket.on('disconnect', () => {
        set({ isConnected: false });
      });

      socket.on('online_users', (users: string[]) => {
        set({ onlineUsers: users });
      });

      socket.connect();
      set({ socket });
    },

    disconnect: () => {
      const { socket } = get();
      if (socket) {
        socket.disconnect();
      }
      set({ socket: null, isConnected: false });
    },

    setSocket: (socket: Socket | null) => {
      set({ socket });
    },

    joinConversation: (conversationId: string) => {
      const { socket, joinedConversations } = get();
      if (socket) {
        // Only join if not already joined
        if (!joinedConversations.has(conversationId)) {
          socket.emit('join_conversation', conversationId);
          joinedConversations.add(conversationId);
          set({ joinedConversations });
        } else {
          console.log(`Already joined conversation ${conversationId}`);
        }
      }
    },
    leaveConversation: (conversationId: string) => {
      const { socket } = get();
      if (socket) {
        socket.emit('leave_conversation', conversationId);
      }
    },

    sendMessage: (conversationId: string, text: string) => {
      const { socket } = get();
      const senderId = useAuthStore.getState().user?._id;
      if (socket) {
        socket.emit('send_message', { conversationId, text, senderId });
      }
    },

    emitTyping: (conversationId: string) => {
      const { socket } = get();
      if (socket) {
        socket.emit('typing', conversationId);
      }
    },

    emitStopTyping: (conversationId: string) => {
      const { socket } = get();
      if (socket) {
        socket.emit('stop_typing', conversationId);
      }
    },

    setOnlineUsers: (users: string[]) => {
      set({ onlineUsers: users });
    },

    setActiveConversationId: (conversationId: string | null) => {
      set({ activeConversationId: conversationId });
    },
  })
);
