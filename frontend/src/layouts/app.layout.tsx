import React, { useEffect } from 'react';
import Sidebar from '@/components/sidebar';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useSocketStore } from '@/stores/socket.store';
import useMessageListener from '@/hooks/socket/use-message-listener';
import useConversationListener from '@/hooks/socket/use-conversation-listener';

const AppLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { connect: connectSocket } = useSocketStore();

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }
  }, [isAuthenticated, connectSocket]);

  useMessageListener();
  useConversationListener();

  return (
    <div className="bg-base-200 h-screen px-4 pt-24 pb-4">
      <div className="bg-base-100 m-auto h-full w-full max-w-7xl rounded-lg">
        <div className="flex h-full overflow-hidden rounded-lg">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
