/**
 * Generates a six-digit OTP (One-Time Password).
 * @returns {string} A six-digit OTP as a string.
 */
export const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}