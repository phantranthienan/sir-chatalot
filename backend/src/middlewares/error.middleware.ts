import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { ApiError } from '@/errors/api.errors'
import { ApiResponse } from '@/types/responses/response.type';
import { errorResponse } from '@/utils/response.util';
import { MESSAGES } from '@/constants/messages';

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response<ApiResponse<null>>, 
    next: NextFunction
) => {
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