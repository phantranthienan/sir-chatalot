import axios from 'axios';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '@/utils/token.utils';
import { useAuthStore } from '@/stores/auth.store';

import { MESSAGES } from '@/constants/messages';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Error in axios:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ---- 401 refresh logic ----
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (error.response.data.message === MESSAGES.ACCESS_TOKEN_EXPIRED ||
        error.response.data.message === MESSAGES.ACCESS_TOKEN_INVALID ||
        error.response.data.message === MESSAGES.ACCESS_TOKEN_MISSING)
    ) {
      originalRequest._retry = true;
      try {
        const {
          data: {
            data: { accessToken },
          },
        } = await axiosInstance.post('/auth/refresh-token');

        setAccessToken(accessToken);
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (error) {
        clearAccessToken();
        useAuthStore.getState().unAuthenticate();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }

    // ---- Fallback: rethrow all other errors ----
    return Promise.reject(error);
  }
);

export default axiosInstance;
