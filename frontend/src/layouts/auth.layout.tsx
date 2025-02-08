import { Outlet, Navigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

const AuthLayout = () => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <div className="text-primary bg-primary/10 mb-2 flex items-center space-x-2 rounded-lg p-3">
        <MessageSquare size={36} />
      </div>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
