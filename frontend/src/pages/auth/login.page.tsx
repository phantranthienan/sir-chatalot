import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import useNotification from '@/hooks/use-notification';
import { useAuthStore } from '@/stores/auth.store';

import * as authApi from '@/services/api/auth.api';

import { loginSchema, LoginInput } from '@/utils/validations/auth.schema';
import { setAccessToken } from '@/utils/token.utils';

import { Mail, Eye, EyeOff, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';

import { LINKS } from '@/constants/links';
import { ERROR_CONTEXTS } from '@/constants/error-contexts';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { authenticate } = useAuthStore();
  const { handleSuccess, handleError } = useNotification();

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const response = await authApi.login(data);
      if (response.data?.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      if (response.data?.user) {
        authenticate(response.data.user);
      }
      handleSuccess(response.message);
      navigate('/');
    } catch (error) {
      handleError(error, ERROR_CONTEXTS.LOGIN);
    }
  };

  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Welcome Back!</h1>
        <p className="text-base-content/60">
          Log in to your account to continue
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="fieldset w-xs sm:w-sm">
          <span className="fieldset-label text-base font-medium">Email</span>
          <div className="input input-bordered w-full">
            <Mail className="text-base-content/40 pointer-events-none" />
            <input
              type="text"
              placeholder="you@example.com"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <span className="text-error text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="fieldset w-xs sm:w-sm">
          <span className="fieldset-label text-base font-medium">Password</span>
          <div className="input input-bordered w-full">
            <LockKeyhole className="text-base-content/40 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="•••••••••••••••••••••"
              {...register('password')}
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
          {errors.password && (
            <span className="text-error text-sm">
              {errors.password.message}
            </span>
          )}
          <span className="fieldset-label ml-auto text-sm">
            Forgot your password?{' '}
            <Link className="link link-primary" to={LINKS.FORGOT_PASSWORD}>
              Click here
            </Link>
          </span>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner" />
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <footer className="mt-8 text-center">
        <p className="text-base-content/60">
          Don't have account yet?{' '}
          <Link to={LINKS.REGISTER} className="link link-primary">
            Register here
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default LoginPage;
