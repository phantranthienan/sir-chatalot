import React from 'react';
import avatarFallback from '@/assets/avatar.png';

export interface Friend {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface FriendCardProps {
  friend: Friend;
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  return (
    <div className="bg-base-200 flex items-center gap-4 rounded-lg p-2 shadow">
      <img
        src={friend.avatarUrl || avatarFallback}
        alt={friend.username}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div>
        <h3 className="text-md font-medium">{friend.username}</h3>
      </div>
    </div>
  );
};

export default FriendCard;
