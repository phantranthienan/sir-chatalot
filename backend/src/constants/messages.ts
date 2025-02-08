export const MESSAGES = {
    //************ SUCCESS MESSAGES ***************/
    // Auth messages
    USER_REGISTERED: 'User registered successfully, please verify your email',
    VERIFICATION_CODE_SENT: 'Verification code sent to your email',
    USER_LOGGED_IN: 'Login successful',
    USER_LOGGED_OUT: 'Logout successful',
    USER_VERIFIED: 'User verified successfully',
    USER_AUTH_CHECKED: 'User checked successfully',
    RESET_PASSWORD_EMAIL_SENT: 'A password reset link has been sent to your email',
    RESET_PASSWORD_SUCCESS: 'Password reset successful',


    //JWT messages
    NEW_TOKEN_GENERATED: 'New access token generated',

    //************ ERROR MESSAGES ***************/
    // Auth messages
    EMAIL_ALREADY_REGISTERED: 'Email already registered',
    USER_ALREADY_VERIFIED: 'User is already verified',
    USER_NOT_FOUND: 'User not found',
    WRONG_PASSWORD: 'Wrong password',
    USER_NOT_VERIFIED: 'User is not verified',
    VERIFICATION_CODE_NOT_FOUND: 'Verification code not found',
    VERIFICATION_CODE_EXPIRED: 'Verification code expired',
    VERIFICATION_CODE_INVALID: 'Invalid verification code',
    RESET_PASSWORD_TOKEN_NOT_FOUND: 'Reset password token not found',
    RESET_PASSWORD_TOKEN_INVALID: 'Invalid reset password token',
    RESET_PASSWORD_TOKEN_EXPIRED: 'Reset password token expired',

    // JWT messages
    REFRESH_TOKEN_EXPIRED: 'Refresh token expired',
    REFRESH_TOKEN_INVALID: 'Invalid refresh token',
    REFRESH_TOKEN_MISSING: 'Refresh token missing',
    ACCESS_TOKEN_INVALID: 'Invalid access token',
    ACCESS_TOKEN_EXPIRED: 'Access token expired',
    ACCESS_TOKEN_MISSING: 'Access token missing',

    // Validation messages
    VALIDATION_ERROR: 'Invalid request data',

    // Server messages
    INTERNAL_SERVER_ERROR: 'Internal server error',
} as const;
