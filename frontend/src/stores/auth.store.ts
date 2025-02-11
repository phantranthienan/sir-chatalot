import { create } from 'zustand';
import * as authApi from '@/services/api/auth.api';

import { UserData } from '@/types/api/common.types';
type AuthStates = {
  user: UserData | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
};

type AuthActions = {
  checkAuth: () => Promise<void>;
  authenticate: (userData: UserData) => Promise<void>;
  unAuthenticate: () => Promise<void>;
};

export const useAuthStore = create<AuthStates & AuthActions>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await authApi.checkAuth();
      const userData = response.data?.user;
      if (userData) {
        get().authenticate(userData);
      }
    } catch (error) {
      get().unAuthenticate();
      throw error;
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  authenticate: async (userData) => {
    set({ user: userData, isAuthenticated: true });
  },

  unAuthenticate: async () => {
    set({ user: null, isAuthenticated: false });
  },
}));
