import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import * as authApi from '@/services/api/auth.api';
import useNotification from '@/hooks/use-notification';
import { ERROR_CONTEXTS } from '@/constants/error-contexts';
import { AxiosError } from 'axios';
import { MESSAGES } from '@/constants/messages';

const VerifyAccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleSuccess, handleError } = useNotification();

  const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
  const inputRefs = React.useRef<HTMLInputElement[]>([]);

  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    const allFilled = otp.every((digit) => digit !== '');
    if (allFilled) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const handleSubmit = async () => {
    const otpValue = otp.join('');
    // Call API to verify OTP
    try {
      const response = await authApi.verifyAccount({
        email: email as string,
        otp: otpValue,
      });
      handleSuccess(response.message + ', please login');
      navigate('/auth/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message === MESSAGES.USER_ALREADY_VERIFIED) {
          navigate('/auth/login');
        }
      }
      handleError(error, ERROR_CONTEXTS.VERIFY_ACCOUNT);
    }
  };

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // move focus to the next input field
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Clear previous input if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      } else if (otp[index]) {
        // Clear current input if has value
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }

    if (
      !/[0-9]/.test(e.key) &&
      !['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleResend = async () => {
    try {
      const response = await authApi.resendVerificationOtp({
        email: email as string,
      });
      handleSuccess(response.message);
    } catch (error) {
      handleError(error, ERROR_CONTEXTS.RESEND_OTP);
    }
  };

  return (
    <div>
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold">Verify Your Account</h1>
        <p className="text-base-content/60">
          Enter the 6-digit code sent to your email
        </p>
      </header>

      <div className="space-y-4">
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="input input-bordered w-8 cursor-default text-center caret-transparent"
            />
          ))}
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-base-content/60">
          Didn't receive the code?{' '}
          <button
            className="link link-primary cursor-pointer border-none bg-transparent"
            onClick={handleResend}
          >
            Resend
          </button>
        </p>
      </footer>
    </div>
  );
};

export default VerifyAccountPage;
