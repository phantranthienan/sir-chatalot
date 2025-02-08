import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';

import useNotification from '@/hooks/use-notification';

import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from '@/utils/validations/auth.schema';

import * as authApi from '@/services/api/auth.api';

import { Mail } from 'lucide-react';
import { LINKS } from '@/constants/links';
import { ERROR_CONTEXTS } from '@/constants/error-contexts';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { handleSuccess, handleError } = useNotification();

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const resposne = await authApi.forgotPassword(data);
      handleSuccess(resposne.message);
      navigate(LINKS.LOGIN);
    } catch (error) {
      handleError(error, ERROR_CONTEXTS.FORGOT_PASSWORD);
    }
  };

  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Forgot Your Password?</h1>
        <p className="text-base-content/60">
          Enter your email to receive a reset link
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

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            'Receive Reset Link'
          )}
        </button>
      </form>

      <footer className="mt-8 text-center">
        <p className="text-base-content/60">
          Remember now?{' '}
          <Link to={LINKS.LOGIN} className="link link-primary">
            Back to login
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;
