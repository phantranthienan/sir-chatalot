import React from 'react';
import { useNotificationStore } from '@/stores/notification.store';
import { CircleCheck, Info, AlertTriangle, XCircle } from 'lucide-react';

const Notification: React.FC = () => {
  const { isVisible, message, type } = useNotificationStore();

  if (!isVisible) return null;

  const alertTypeClass = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  return (
    <div className="toast toast-top toast-center mx-0 max-w-sm">
      <div
        className={`alert ${alertTypeClass[type]} alert-vertical sm:alert-horizontal m-auto gap-0.5 sm:gap-3`}
      >
        {type === 'info' && <Info size={20} />}
        {type === 'success' && <CircleCheck size={20} />}
        {type === 'warning' && <AlertTriangle size={20} />}
        {type === 'error' && <XCircle size={20} />}
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
