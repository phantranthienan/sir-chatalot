import jwt from 'jsonwebtoken';
import { ENV } from '@/config/env';

// Secret keys
const ACCESS_TOKEN_SECRET = ENV.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = ENV.REFRESH_TOKEN_SECRET!;

// Token expiration time
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

/**
 * Generate an access token
 * @param payload - Data to encode in the token (e.g., user ID)
 * @returns JWT access token
 */
export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

/**
 * Generate a refresh token
 * @param payload - Data to encode in the refresh token
 * @returns JWT refresh token
 */
export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

/**
 * Verify an access token
 * @param token - JWT access token
 * @returns Decoded token
 */
export const verifyAccessToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
};

/**
 * Verify a refresh token
 * @param token - JWT refresh token
 * @returns Decoded token
 */
export const verifyRefreshToken = (token: string): jwt.JwtPayload => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as jwt.JwtPayload;
}