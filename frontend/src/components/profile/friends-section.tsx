// src/components/profile/FriendsSection.tsx
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

interface FriendsGridProps {
  friends: Friend[];
}

interface FriendsSectionProps {
  friends: Friend[];
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

const FriendsGrid: React.FC<FriendsGridProps> = ({ friends }) => {
  if (!friends.length) {
    return (
      <p className="text-center text-sm text-zinc-400">No friends found</p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {friends.map((friend) => (
        <FriendCard key={friend._id} friend={friend} />
      ))}
    </div>
  );
};

const FriendsSection: React.FC<FriendsSectionProps> = ({ friends }) => (
  <div className="bg-base-300 mt-6 rounded-xl p-6">
    <h2 className="mb-4 text-lg font-medium">Your Friends</h2>
    <FriendsGrid friends={friends} />
  </div>
);

export default FriendsSection;
