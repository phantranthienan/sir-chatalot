import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useNotification from '@/hooks/use-notification';

import * as authApi from '@/services/api/auth.api';
import { registerSchema, RegisterInput } from '@/utils/validations/auth.schema';

import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

import { LINKS } from '@/constants/links';
import { ERROR_CONTEXTS } from '@/constants/error-contexts';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { handleSuccess, handleError } = useNotification();

  const {
    register,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const response = await authApi.register(data);
      handleSuccess(response.message);
      navigate(`${LINKS.VERIFY_ACCOUNT}?email=${data.email}`);
    } catch (error) {
      handleError(error, ERROR_CONTEXTS.REGISTER);
    }
  };

  return (
    <div>
      {/* Header for register form */}
      <header className="text-center sm:mb-8">
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-base-content/60">
          Get started with your free account
        </p>
      </header>

      {/* Register form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:my-4">
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
        </div>

        <div className="fieldset w-xs sm:w-sm">
          <span className="fieldset-label text-base font-medium">
            Confirm Password
          </span>
          <div className="input input-bordered w-full">
            <LockKeyhole className="text-base-content/40 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="•••••••••••••••••••••"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <span className="text-error text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      {/* Footer for register form */}
      <footer className="text-center">
        <p className="text-base-content/60">
          Already have an account?{' '}
          <Link to={LINKS.LOGIN} className="link link-primary">
            Login
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default RegisterPage;
