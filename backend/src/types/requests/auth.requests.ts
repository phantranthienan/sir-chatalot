// Type definitions for requests related to authentication

export interface RegisterRequestBody {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface VerifyAccountRequestBody {
    email: string;
    otp: string;
}

export interface ResendVerificationOtpRequestBody {
    email: string;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}

export interface ForgotPasswordRequestBody {
    email: string;
}

export interface ResetPasswordRequestBody {
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}