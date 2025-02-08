import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useNotification from '@/hooks/use-notification';

import {
  resetPasswordSchema,
  ResetPasswordInput,
} from '@/utils/validations/auth.schema';

import * as authApi from '@/services/api/auth.api';

import { LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { ERROR_CONTEXTS } from '@/constants/error-contexts';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { handleSuccess, handleError } = useNotification();
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const { email, token } = {
    email: searchParams.get('email'),
    token: searchParams.get('token'),
  };

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    try {
      const response = await authApi.resetPassword({
        email: email as string,
        token: token as string,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      handleSuccess(response.message + ', please login');
      navigate('/auth/login');
    } catch (error) {
      handleError(error, ERROR_CONTEXTS.RESET_PASSWORD);
    }
  };

  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-base-content/60">Enter your new password below</p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="fieldset w-xs sm:w-sm">
          <span className="fieldset-label text-base font-medium">
            New Password
          </span>
          <div className="input input-bordered w-full">
            <LockKeyhole className="text-base-content/40 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="•••••••••••••••••••••"
              {...register('newPassword')}
            />
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="text-base-content/40" />
              ) : (
                <Eye className="text-base-content/40" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <span className="text-error text-sm">
              {errors.newPassword.message}
            </span>
          )}
        </div>

        <div className="fieldset w-xs sm:w-sm">
          <span className="fieldset-label text-base font-medium">
            Confirm New Password
          </span>
          <div className="input input-bordered w-full">
            <LockKeyhole className="text-base-content/40 pointer-events-none" />
            <input
              type="password"
              placeholder="•••••••••••••••••••••"
              {...register('confirmNewPassword')}
            />
          </div>
          {errors.confirmNewPassword && (
            <span className="text-error text-sm">
              {errors.confirmNewPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
