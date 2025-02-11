import React, { useEffect } from 'react';
import { useSocketStore } from '@/stores/socket.store';
import { MessageSquare } from 'lucide-react';

const HomePage: React.FC = () => {
  const { setActiveConversationId } = useSocketStore();

  useEffect(() => {
    setActiveConversationId(null);
  }, [setActiveConversationId]);

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <div className="max-w-md space-y-2 text-center">
        {/* Icon Display */}
        <div className="bg-primary/10 mx-auto flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl">
          <MessageSquare size={32} className="text-primary" />
        </div>

        {/* Welcome Text */}
        <h2 className="text-2xl font-bold">Welcome to Sir Chatalot!</h2>
        <p className="text-base-content/60">
          Select a conversation to chat a lot
        </p>
      </div>
    </div>
  );
};
export default HomePage;
