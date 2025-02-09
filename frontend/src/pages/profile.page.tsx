import React from 'react';
import {
  useUserProfileQuery,
  useUpdateUserAvatarMutation,
} from '@/hooks/react-query/user-profile';

import avatarFallback from '@/assets/avatar.png';
import { Camera, Mail, User } from 'lucide-react';
import FriendsGrid from '@/components/profile/friend-grids';

const ProfilePage: React.FC = () => {
  const { data: userProfile, isLoading, error } = useUserProfileQuery();
  const { mutate: updateAvatar, isPending: isUpdating } =
    useUpdateUserAvatarMutation();

  const handleImageUpload = () => {};
  return (
    <main className="h-screen pt-16">
      <div className="mx-auto max-w-2xl p-4 py-8">
        <div className="bg-base-300 space-y-8 rounded-xl p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold uppercase">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar */}

          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={userProfile?.avatarUrl || avatarFallback}
                alt="avatar"
                className="size-32 rounded-full border-4 object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className={`bg-base-content bg-opacity-50 absolute right-0 bottom-0 cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-105 ${isUpdating ? 'pointer-events-none animate-pulse' : ''}`}
              >
                <Camera size={24} className="text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
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

          {/* user info */}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <User className="h-4 w-4" />
                Username
              </div>
              <input
                type="text"
                className="bg-base-200 w-full rounded-lg border px-4 py-2.5"
                value={userProfile?.username || ''}
                readOnly
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Mail className="h-4 w-4" />
                Email Address
              </div>
              <p className="bg-base-200 rounded-lg border px-4 py-2.5">
                {userProfile?.email}
              </p>
            </div>
          </div>

          <div className="bg-base-300 mt-6 rounded-xl">
            <h2 className="mb-4 text-lg font-medium">Your Friends</h2>
            <FriendsGrid friends={userProfile?.friends || []} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
