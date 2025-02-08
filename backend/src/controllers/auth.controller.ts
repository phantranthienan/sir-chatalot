import { Request, Response } from 'express';
import { loginUser, refreshAccessToken, registerUser, verifyUserOtp, forgotPassword, resetPassword, resendVerificationOtp } from '@/services/auth.service';
import { successResponse } from '@/utils/response.util';

import { refreshTokenCookieOptions } from '@/config/cookies';
import { MESSAGES } from '@/constants/messages';
import { ApiResponse } from '@/types/responses/response.type';
import { RegisterRequestBody, LoginRequestBody, VerifyAccountRequestBody, ForgotPasswordRequestBody, ResetPasswordRequestBody, ResendVerificationOtpRequestBody } from '@/types/requests/auth.requests';
import { RegisterResponseData, LoginResponseData, RefreshTokenResponseData, CheckAuthResponseData } from '@/types/responses/auth.responses';

export const registerController = async (
    req: Request<{},{},RegisterRequestBody>, 
    res: Response<ApiResponse<RegisterResponseData>>
) => {
    const { email, password } = req.body;
    const newUser = await registerUser(email, password);

    const response = successResponse<RegisterResponseData>(
        MESSAGES.USER_REGISTERED, 
        { 
            user: {
                ...newUser,
                _id: newUser._id.toString(),
            }
        }
    );

    res.status(201).json(response);
};

export const verifyAccountController = async (
    req: Request<{},{},VerifyAccountRequestBody>,
    res: Response<ApiResponse<null>>
) => {
    const { email, otp } = req.body;
    await verifyUserOtp(email, otp);

    const response = successResponse<null>(MESSAGES.USER_VERIFIED, null);
    
    res.status(200).json(response);
};

export const resendVerificationOtpController = async (
    req: Request<{},{},ResendVerificationOtpRequestBody>,
    res: Response<ApiResponse<null>>
) => {
    const { email } = req.body;
    await resendVerificationOtp(email);

    const response = successResponse<null>(MESSAGES.VERIFICATION_CODE_SENT, null);
    res.status(200).json(response);
}

export const loginController = async (
    req: Request<{}, {}, LoginRequestBody>, 
    res: Response<ApiResponse<LoginResponseData>>
) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken, userObject } = await loginUser(email, password);

    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    const response = successResponse<LoginResponseData>(
        MESSAGES.USER_LOGGED_IN, 
        { 
            accessToken, 
            user: { 
                ...userObject, 
                _id: userObject._id.toString() 
            } 
        }
    );

    res.status(200).json(response);
};

export const logoutController = async (
    req: Request,
    res: Response<ApiResponse<null>>
) => {
    res.clearCookie('refreshToken');

    const response = successResponse<null>(MESSAGES.USER_LOGGED_OUT, null);
    res.status(200).json(response);
};

export const refreshTokenController = async (
    req: Request, 
    res: Response<ApiResponse<RefreshTokenResponseData>>
) => {
    const refreshToken = req.cookies.refreshToken;
    const newAccessToken = await refreshAccessToken(refreshToken);

    const response = successResponse<RefreshTokenResponseData>(
        MESSAGES.NEW_TOKEN_GENERATED, 
        { accessToken: newAccessToken }
    );
    
    res.status(200).json(response);
};

export const forgotPasswordController = async (
    req: Request<{},{}, ForgotPasswordRequestBody>,
    res: Response<ApiResponse<null>>
) => {
    const { email } = req.body;
    await forgotPassword(email);

    const response = successResponse<null>(MESSAGES.RESET_PASSWORD_EMAIL_SENT, null);
    res.status(200).json(response);
};

export const resetPasswordController = async (
    req: Request<{},{},ResetPasswordRequestBody>,
    res: Response<ApiResponse<null>>
) => {
    const { email, token, newPassword } = req.body;
    await resetPassword(email, token, newPassword);
    
    const response = successResponse<null>(MESSAGES.RESET_PASSWORD_SUCCESS, null);
    res.status(200).json(response);
};

export const checkAuthController = async (
    req: Request,
    res: Response<ApiResponse<CheckAuthResponseData>>
) => {
    const user = req.user;
    const response = successResponse<CheckAuthResponseData>(
        MESSAGES.USER_AUTH_CHECKED, 
        { 
            user: { 
                ...user, 
                _id: user._id.toString() 
            }
        }
    );
    res.status(200).json(response);
};