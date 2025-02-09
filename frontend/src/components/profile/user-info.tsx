// src/components/profile/UserInfo.tsx
import React from 'react';
import { User, Mail } from 'lucide-react';

interface UserInfoProps {
  username?: string;
  email?: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ username, email }) => (
  <div className="space-y-6">
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <User className="h-4 w-4" />
        Username
      </div>
      <input
        type="text"
        className="bg-base-200 w-full rounded-lg border px-4 py-2.5"
        value={username || ''}
        readOnly
      />
    </div>
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <Mail className="h-4 w-4" />
        Email Address
      </div>
      <p className="bg-base-200 rounded-lg border px-4 py-2.5">{email}</p>
    </div>
  </div>
);

export default UserInfo;
