import axios from '@/services/api/axios.config';

import {
  RegisterRequestBody,
  LoginRequestBody,
  VerifyAccountRequestBody,
  ForgotPasswordRequestBody,
  ResetPasswordRequestBody,
  ResendVerificationOtpRequestBody,
} from '@/types/api/requests/auth.requests';

import {
  RegisterResponseData,
  LoginResponseData,
  CheckAuthResponseData,
} from '@/types/api/responses/auth.responses';
import { ApiResponse } from '@/types/api/responses/response.types';
import { clearAccessToken } from '@/utils/token.utils';

export const register = async (
  registerData: RegisterRequestBody
): Promise<ApiResponse<RegisterResponseData>> => {
  const response = await axios.post<ApiResponse<RegisterResponseData>>(
    '/auth/register',
    registerData
  );
  return response.data;
};

export const verifyAccount = async (
  verifyAccountData: VerifyAccountRequestBody
): Promise<ApiResponse<null>> => {
  const response = await axios.post<ApiResponse<null>>(
    '/auth/verify-account',
    verifyAccountData
  );
  return response.data;
};

export const resendVerificationOtp = async (
  resendVerificationOtpData: ResendVerificationOtpRequestBody
): Promise<ApiResponse<null>> => {
  const response = await axios.post<ApiResponse<null>>(
    '/auth/resend-verification',
    resendVerificationOtpData
  );
  return response.data;
};

export const login = async (
  loginData: LoginRequestBody
): Promise<ApiResponse<LoginResponseData>> => {
  const response = await axios.post<ApiResponse<LoginResponseData>>(
    '/auth/login',
    loginData
  );
  return response.data;
};

export const logout = async (): Promise<ApiResponse<null>> => {
  const response = await axios.post('/auth/logout');
  clearAccessToken();
  return response.data;
};

export const checkAuth = async (): Promise<
  ApiResponse<CheckAuthResponseData>
> => {
  const response =
    await axios.post<ApiResponse<CheckAuthResponseData>>('/auth/check');
  return response.data;
};

export const forgotPassword = async (
  forgotPasswordData: ForgotPasswordRequestBody
): Promise<ApiResponse<null>> => {
  const response = await axios.post<ApiResponse<null>>(
    '/auth/forgot-password',
    forgotPasswordData
  );
  return response.data;
};

export const resetPassword = async (
  resetPasswordData: ResetPasswordRequestBody
): Promise<ApiResponse<null>> => {
  const response = await axios.post<ApiResponse<null>>(
    '/auth/reset-password',
    resetPasswordData
  );
  return response.data;
};
