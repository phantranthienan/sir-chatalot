import { Request, Response, NextFunction } from 'express';
import { decodeAccessToken } from '@/services/auth.service';
import { UnauthorizedError } from '@/errors/api.errors';
import { MESSAGES } from '@/constants/messages';
declare module 'express' {
    export interface Request {
        user?: {
            _id: string;
            email: string;
            username: string;
            avatarUrl: string;
            friends: string[];
        };
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError(MESSAGES.ACCESS_TOKEN_MISSING);
    }

    const accessToken = authHeader.split(' ')[1];
    const user = await decodeAccessToken(accessToken);

    req.user = { ...user, _id: user._id.toString(), friends: user.friends.map(friend => friend.toString()) };
    next();
};
