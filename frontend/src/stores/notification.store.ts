import { create } from 'zustand';

const TIME_OUT = 3000;

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationStates {
  isVisible: boolean;
  message: string;
  type: NotificationType;
  show: (message: string, type: NotificationType) => void;
  hide: () => void;
}

export const useNotificationStore = create<NotificationStates>((set) => ({
  isVisible: false,
  message: '',
  type: 'info',

  show: (message, type = 'info') => {
    set({ isVisible: true, message, type });
    setTimeout(() => {
      set({ isVisible: false });
    }, TIME_OUT);
  },

  hide: () => {
    set({ isVisible: false });
  },
}));
