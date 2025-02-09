import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useNotification from '@/hooks/use-notification';
import { useAuthStore } from '@/stores/auth.store';

import * as authApi from '@/services/api/auth.api';

import { LINKS } from '@/constants/links';

import { LogOut, MessageSquare, Settings, User } from 'lucide-react';
import { clearAccessToken } from '@/utils/token.utils';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, unAuthenticate } = useAuthStore();
  const { handleSuccess, handleError } = useNotification();

  const handleLogout = async () => {
    try {
      const response = await authApi.logout();
      clearAccessToken();
      unAuthenticate();
      handleSuccess(response.message);
      navigate(LINKS.LOGIN);
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <nav className="navbar bg-base-100 border-base-300 fixed top-0 z-40 w-full border-b backdrop-blur-lg">
      <div className="container mx-auto h-16 px-4">
        <div className="flex h-full items-center justify-between">
          <Link
            to={LINKS.HOME}
            className="flex items-center gap-2 transition-all hover:opacity-80"
          >
            <div className="bg-primary/10 flex items-center justify-center rounded-lg p-2">
              <MessageSquare size={32} className="text-primary" />
            </div>
            <h1 className="text-lg font-bold">Sir Chatalot</h1>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={LINKS.SETTING}
              className="btn btn-sm btn-ghost gap-2 py-5"
            >
              <Settings size={20} />
              <span className="hidden text-sm font-medium sm:inline">
                Settings
              </span>
            </Link>

            {user && (
              <>
                <Link
                  to={LINKS.PROFILE}
                  className="btn btn-sm btn-ghost gap-2 py-5"
                >
                  <User size={20} />
                  <span className="hidden text-sm font-medium sm:inline">
                    Profile
                  </span>
                </Link>

                <button
                  className="btn btn-sm btn-ghost gap-2 py-5"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  <span className="hidden text-sm font-medium sm:inline">
                    Logout
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
