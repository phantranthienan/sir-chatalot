import { ENV } from './env';

export const corsOptions = {
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
        if (ENV.NODE_ENV === 'development' || ENV.NODE_ENV === 'test') {
            return callback(null, true);
        } else if (!origin || ENV.CORS_ORIGIN.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}