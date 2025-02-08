import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string()
      .nonempty({ message: 'Email cannot be empty' })
      .email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/.test(value), {
        message: 'Password must contain at least one letter and one number',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email cannot be empty' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email cannot be empty' })
    .email({ message: 'Invalid email address' }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .refine((value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{1,}$/.test(value), {
        message: 'Password must contain at least one letter and one number',
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
