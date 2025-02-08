import express from 'express';
import { validateRequest } from '@/middlewares/validation.middleware';
import { registerSchema, loginSchema, verifyAccountSchema, forgotPasswordSchema, resetPasswordSchema } from '@/utils/validations/auth.validation';
import { registerController, loginController, logoutController, refreshTokenController, verifyAccountController, forgotPasswordController, resetPasswordController, checkAuthController, resendVerificationOtpController } from '@/controllers/auth.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), registerController);

router.post('/verify-account', validateRequest(verifyAccountSchema), verifyAccountController); 

router.post('/resend-verification', resendVerificationOtpController);

router.post('/login', validateRequest(loginSchema), loginController);

router.post('/logout', logoutController);

router.post('/refresh-token', refreshTokenController);

router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPasswordController);

router.post('/reset-password', validateRequest(resetPasswordSchema), resetPasswordController);

router.post('/check', authMiddleware, checkAuthController);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user in the system.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully, a verification code will be sent to provided email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User registered successfully, a verification code has been sent to your email"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60bbf824f72e8e3a69cb3d1a"
 *                     username:
 *                       type: string
 *                       example: "user"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       400:
 *         description: Validation error. The response will contain an array of error details indicating which fields failed validation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       path:
 *                         type: string
 *                         example: "email"
 *                       message:
 *                         type: string
 *                         example: "Invalid email address"
 *       409:
 *         description: Email already registered.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/verify-account:
 *   post:
 *     summary: Verify user email
 *     description: Verifies a user's email by checking the 6-digit OTP provided in the request body. The OTP expires in 24 hours.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User verified successfully"
 *       400:
 *         description: Invalid or expired verification code or user already verified.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification code
 *     description: Resends the 6-digit verification code to the user's email if they haven't verified their account yet.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Verification code sent to your email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verification code sent to your email"
 *       400:
 *         description: User already verified.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns an access token. The refresh token is stored in an HttpOnly cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "jwt_access_token_here"
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Wrong password or user not verified.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */ 

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the user
 *     description: Logs out the user by clearing the refresh token cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully"
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using the refresh token stored in an HttpOnly cookie.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token generated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "New access token generated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: "new_jwt_access_token_here"
 *       401:
 *         description: Refresh token missing or invalid or expired.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Initiate password reset
 *     description: Sends a password reset link to the specified email if it exists.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset link sent.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using the reset token sent via email.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - token
 *               - newPassword
 *               - confirmNewPassword
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               token:
 *                 type: string
 *                 example: "reset_token_here"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *               confirmNewPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Validation error or token mismatch/expired.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /auth/check:
 *   post:
 *     summary: Check user authentication status
 *     description: Verifies if the user's access token is valid. Requires a valid access token in the Authorization header.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # Indicates that the route requires Bearer token (JWT)
 *     responses:
 *       200:
 *         description: User is authenticated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User is authenticated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "60bbf824f72e8e3a69cb3d1a"
 *                     username: 
 *                       type: string
 *                       example: "user"
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *       401:
 *         description: Unauthorized. Invalid or missing access token.
 *       500:
 *         description: Internal server error.
 */

export default router;