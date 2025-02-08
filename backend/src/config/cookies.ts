import { ENV } from './env';

export const refreshTokenCookieOptions = {
    httpOlly: true,
    secure: ENV.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;
