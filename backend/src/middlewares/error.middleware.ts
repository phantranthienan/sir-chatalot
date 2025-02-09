import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { MulterError } from 'multer';

import { ApiError } from '@/errors/api.errors'
import { ApiResponse } from '@/types/responses/response.type';
import { errorResponse } from '@/utils/response.utils';
import { MESSAGES } from '@/constants/messages';
import { FileTooLargeError } from '@/errors/file.errors';

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response<ApiResponse<null>>, 
    next: NextFunction
) => {
    console.error(err);
    if (err instanceof MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            const fileTooLarge = new FileTooLargeError();
            
            const response = errorResponse(fileTooLarge.message);
            res.status(fileTooLarge.statusCode).json(response);
            return;
        }
    }

    if (err instanceof ZodError) {
        const errors = err.errors.map((error) => {
            return {
                path: error.path.join('.'),
                message: error.message,
            };
        });

        const response = errorResponse(MESSAGES.VALIDATION_ERROR, errors);
        res.status(400).json(response);
        return;
    }

    if (err instanceof ApiError) {
        const response = errorResponse(err.message);
        res.status(err.statusCode).json(response);
        return;
    }

    const response = errorResponse(MESSAGES.INTERNAL_SERVER_ERROR);
    res.status(500).json(response);
    return;
};