import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatarFallback from '@/assets/avatar.png';
import { X } from 'lucide-react';
import { LINKS } from '@/constants/links';

interface ChatHeaderProps {
  username: string;
  avatarUrl: string;
  isOnline: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  username,
  avatarUrl,
  isOnline,
}) => {
  const navigate = useNavigate();
  return (
    <header className="border-base-200 border-b-4 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="relative size-12 rounded-full">
              <img src={avatarUrl || avatarFallback} alt={username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h2 className="font-medium">{username}</h2>
            <p className="text-base-content/50 text-sm">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => navigate(LINKS.HOME)}
          className="btn btn-circle btn-ghost btn-sm"
        >
          <X size={20} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
