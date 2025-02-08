import React from 'react';
import { useNavigate } from 'react-router-dom';

import useNotification from '@/hooks/use-notification';
import { useAuthStore } from '@/stores/auth.store';

import * as authApi from '@/services/api/auth.api';
import { LINKS } from '@/constants/links';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { unAuthenticate } = useAuthStore();
  const { handleSuccess, handleError } = useNotification();

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      unAuthenticate();
      handleSuccess(response.message);
      navigate(LINKS.LOGIN);
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-4 px-4">
      <h1 className="text-base-content tracking-widest uppercase">Home Page</h1>
      <button onClick={handleLogout} className="btn btn-error uppercase">
        Logout
      </button>
    </main>
  );
};

export default HomePage;
