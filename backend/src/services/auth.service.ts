import crypto from 'crypto';
import { User } from '@/models/user.model';
import { ConflictError, NotFoundError, UnauthorizedError, BadRequestError } from '@/errors/api.errors';
import { JsonWebTokenError } from 'jsonwebtoken';

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '@/utils/jwt.util';
import { hashPassword, comparePassword } from '@/utils/bcrypt.util';
import { sendForgotPasswordEmail, sendVerificationOtpEmail } from '@/utils/nodemailer.util';
import { generateOTP } from '@/utils/otp.util';

import { MESSAGES } from '@/constants/messages';
import { ENV } from '@/config/env';

export const registerUser = async (email: string, password: string) => {
    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        if (existingUser.isVerified) {
            throw new ConflictError(MESSAGES.EMAIL_ALREADY_REGISTERED);
        }
        // If the user exists but is not verified (perhaps OTP expired), update the OTP details.
        const newOtp = generateOTP();
        const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const hashedPassword = await hashPassword(password);

        existingUser.password = hashedPassword;
        existingUser.verificationCode = newOtp;
        existingUser.verificationCodeExpiresAt = otpExpiresAt;
        await existingUser.save();
        
        // Resend the verification OTP email
        await sendVerificationOtpEmail(email, newOtp);

        const userObject = existingUser.toObject();

        return userObject;
    }
    // set username
    const username = email.split('@')[0];

    // hash password
    const hashedPassword = await hashPassword(password);

    // Generate a 6-digit OTP and set expiration for 24 hours from now
    const otp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // create new user
    const newUser = new User({ 
        email, 
        username,
        password: hashedPassword, 
        isVerified: false,
        verificationCode: otp,
        verificationCodeExpiresAt: otpExpiresAt,
    });
    await newUser.save();

    // send verification email
    await sendVerificationOtpEmail(email, otp);

    const userObject = newUser.toObject();

    return userObject;
};

export const verifyUserOtp = async (email: string, otp: string) => {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }
    if (user.isVerified) {
        throw new BadRequestError(MESSAGES.USER_ALREADY_VERIFIED);
    }
    if (!user.verificationCode || !user.verificationCodeExpiresAt) {
        throw new NotFoundError(MESSAGES.VERIFICATION_CODE_NOT_FOUND);
    }
    if (user.verificationCode !== otp) {
        throw new BadRequestError(MESSAGES.VERIFICATION_CODE_INVALID);
    }
    if (new Date() > user.verificationCodeExpiresAt) {
        throw new BadRequestError(MESSAGES.VERIFICATION_CODE_EXPIRED);
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiresAt = undefined;
    await user.save();
}

export const resendVerificationOtp = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }
    if (user.isVerified) {
        throw new BadRequestError(MESSAGES.USER_ALREADY_VERIFIED);
    }

    const newOtp = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.verificationCode = newOtp;
    user.verificationCodeExpiresAt = otpExpiresAt;
    await user.save();

    await sendVerificationOtpEmail(email, newOtp);
};

export const loginUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }
    if (!user.isVerified) {
        throw new UnauthorizedError(MESSAGES.USER_NOT_VERIFIED);
    }

    const passwordMatch = await comparePassword(password, user.password);

    if (!passwordMatch) {
        throw new UnauthorizedError(MESSAGES.WRONG_PASSWORD);
    }

    const userObject = user.toObject();

    const payload = { userId: userObject._id };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken, userObject };
};

export const refreshAccessToken = async (refreshToken: string) => {
    if (!refreshToken) {
        throw new UnauthorizedError(MESSAGES.REFRESH_TOKEN_MISSING);
    }

    try {
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken({ userId: decodedRefreshToken.userId });
        return newAccessToken;
    } catch (error: unknown) {
        if (error instanceof JsonWebTokenError) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedError(MESSAGES.REFRESH_TOKEN_EXPIRED);
            }
            if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedError(MESSAGES.REFRESH_TOKEN_INVALID);
            }
        }
        throw error;
    }
};

export const forgotPassword = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }
    if (!user.isVerified) {
        throw new UnauthorizedError(MESSAGES.USER_NOT_VERIFIED);
    }

    // Generate a random token (you can also hash it if desired)
    const resetPasswordToken = crypto.randomBytes(32).toString('hex');
    // Set expiration time (e.g., 1 hour from now)
    const resetPasswordTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);

    // Update the user document
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    await user.save();

    // Create a reset link (include email for convenience)
    const resetLink = `${ENV.FRONTEND_URL}/auth/reset-password?token=${resetPasswordToken}&email=${email}`;
    await sendForgotPasswordEmail(email, resetLink);
};

export const resetPassword = async (email: string, token: string, newPassword: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
    }

    if (!user.resetPasswordToken || !user.resetPasswordTokenExpiresAt) {
        throw new BadRequestError(MESSAGES.RESET_PASSWORD_TOKEN_NOT_FOUND);
    }
    if (new Date() > user.resetPasswordTokenExpiresAt) {
        throw new BadRequestError(MESSAGES.RESET_PASSWORD_TOKEN_EXPIRED);
    }
    if (user.resetPasswordToken !== token) {
        throw new BadRequestError(MESSAGES.RESET_PASSWORD_TOKEN_INVALID);
    }

    // Token is valid; update the password
    user.password = await hashPassword(newPassword);
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();
};

export const decodeAccessToken = async (accessToken: string) => {
    try {
        const decodedToken = verifyAccessToken(accessToken);
        if (!decodedToken) {
            throw new UnauthorizedError(MESSAGES.ACCESS_TOKEN_INVALID);
        }

        const { userId } = decodedToken;
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError(MESSAGES.USER_NOT_FOUND);
        }

        const userObject = user.toObject();
        return userObject;
    } catch (error: unknown) {
        if (error instanceof JsonWebTokenError) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedError(MESSAGES.ACCESS_TOKEN_EXPIRED);
            }
            if (error.name === 'JsonWebTokenError') {
                throw new UnauthorizedError(MESSAGES.ACCESS_TOKEN_INVALID);
            }
        }
        throw error;
    }
}