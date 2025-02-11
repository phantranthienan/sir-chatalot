// src/pages/ProfilePage.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import {
  useUserProfileQuery,
  useUpdateUserAvatarMutation,
} from '@/hooks/react-query/user-profile';
import useNotification from '@/hooks/use-notification';

import ProfileHeader from '@/components/profile/profile-header';
import AvatarSection from '@/components/profile/avatar-section';
import UserInfo from '@/components/profile/user-info';
import FriendsSection from '@/components/profile/friends-section';
import Loading from '@/components/ui/loading';

const ProfilePage: React.FC = () => {
  const { handleError } = useNotification();
  const { data: userProfile, isLoading, error } = useUserProfileQuery();
  const { mutate: updateAvatar, isPending: isUpdating } =
    useUpdateUserAvatarMutation();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updateAvatar(e.target.files[0]);
    }
  };

  if (isLoading) return <Loading />;

  if (error) {
    handleError(error);
    return <Navigate to="/" />;
  }

  return (
    <main className="h-screen pt-16">
      <div className="mx-auto max-w-2xl p-4 py-8">
        <div className="bg-base-300 space-y-8 rounded-xl p-6">
          <ProfileHeader />
          <AvatarSection
            avatarUrl={userProfile?.avatarUrl}
            isUpdating={isUpdating}
            onImageUpload={handleImageUpload}
          />
          <UserInfo
            username={userProfile?.username}
            email={userProfile?.email}
          />
          <FriendsSection friends={[]} />
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
