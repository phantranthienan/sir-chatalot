// src/components/profile/AvatarSection.tsx
import React from 'react';
import { Camera } from 'lucide-react';
import avatarFallback from '@/assets/avatar.png';

interface AvatarSectionProps {
  avatarUrl?: string;
  isUpdating: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({
  avatarUrl,
  isUpdating,
  onImageUpload,
}) => (
  <div className="flex flex-col items-center space-y-4">
    <div className="relative">
      <img
        src={avatarUrl || avatarFallback}
        alt="avatar"
        className="size-32 rounded-full border-4 object-cover"
      />
      <label
        htmlFor="avatar-upload"
        className={`bg-base-content bg-opacity-50 absolute right-0 bottom-0 cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-105 ${
          isUpdating ? 'pointer-events-none animate-pulse' : ''
        }`}
      >
        <Camera size={24} className="text-base-200" />
        <input
          type="file"
          id="avatar-upload"
          className="hidden"
          accept="image/*"
          onChange={onImageUpload}
          disabled={isUpdating}
        />
      </label>
    </div>
    <p className="text-sm text-zinc-400">
      {isUpdating ? (
        <>
          <span>Updating avatar </span>
          <span className="loading loading-dots"></span>
        </>
      ) : (
        'Click the camera to update avatar'
      )}
    </p>
  </div>
);

export default AvatarSection;
