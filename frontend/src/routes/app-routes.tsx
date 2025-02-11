/* eslint-disable prettier/prettier */
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loading from '@/components/ui/loading';
import AuthLayout from '@/layouts/auth.layout';
import ProtectedRoute from './protected-route';
import { LINKS } from '@/constants/links';

const AppLayout = lazy(() => import('@/layouts/app.layout'));
const HomePage = lazy(() => import('@/pages/app/home.page'));
const ConversationPage = lazy(() => import('@/pages/app/conversation.page'));

const ProfilePage = lazy(() => import('@/pages/profile.page'));
const SettingPage = lazy(() => import('@/pages/setting.page'));

const LoginPage = lazy(() => import('@/pages/auth/login.page'));
const RegisterPage = lazy(() => import('@/pages/auth/register.page'));
const VerifyAccountPage = lazy(() => import('@/pages/auth/verify-account.page'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/forgot-password.page'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/reset-password.page'));
const NotFoundPage = lazy(() => import('@/pages/not-found.page'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path={LINKS.HOME} element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path=":conversationId" element={<ConversationPage/>} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path={`${LINKS.HOME}/setting`} element={<SettingPage />} />
        {/* Auth routes */}
        <Route path={LINKS.AUTH} element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-account" element={<VerifyAccountPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* 404 */}
        <Route path={LINKS.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
