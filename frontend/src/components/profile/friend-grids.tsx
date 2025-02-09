import React from 'react';
import FriendCard, { Friend } from './friend-card';

interface FriendsGridProps {
  friends: Friend[];
}

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

export default FriendsGrid;
