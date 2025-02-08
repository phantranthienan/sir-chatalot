import { useCallback } from 'react';
import { AxiosError } from 'axios';
import { useNotificationStore } from '@/stores/notification.store';

const useNotification = () => {
  const { show } = useNotificationStore();

  const handleSuccess = useCallback(
    (message: string) => {
      show(message, 'success');
    },
    [show]
  );

  const handleError = useCallback(
    (error: unknown, context?: string) => {
      let message = 'An unexpected error occurred';

      if (error instanceof AxiosError) {
        message =
          error.response?.data?.message || error.message || 'Request failed';
      } else if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }

      if (context) {
        message = `${context}: ${message}`;
      }

      show(message, 'error');
    },
    [show]
  );

  return { handleSuccess, handleError };
};

export default useNotification;
