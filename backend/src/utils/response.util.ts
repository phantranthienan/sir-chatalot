import { ApiResponse } from '@/types/responses/response.type';

/**
 * Creates a success API response object
 * @param message - A success message
 * @param data - (Optional) any data to return (e.g., user details)
 */
export const successResponse = <T>(message: string, data?: T): ApiResponse<T> => {
    return {
        success: true,
        message,
        data,
    };
};

/**
 * Creates an error API response object
 * @param message - An error message
 * @param errors - (Optional) an array of { path, message } objects
 */
export const errorResponse = (
    message: string,
    errors?: { path: string; message: string }[]
): ApiResponse<null> => {
    return {
        success: false,
        message,
        data: null,
        errors,
    };
};
