import 'express-async-errors';

import express, { json, urlencoded } from 'express';

import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB, disconnectDB, checkDBConnection } from '@/config/db';
import { rateLimiter } from '@/config/rate-limiter.config';
import { corsOptions } from '@/config/cors';
import { setupSwagger } from '@/config/swagger.config';
import { ENV } from '@/config/env';

import { notFoundHandler } from './middlewares/notfound.middleware';
import { errorHandler } from './middlewares/error.middleware';
import appRouter from '@/routes';

const app = express();

console.log(ENV);

// Connect to MongoDB
connectDB();

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server');
    await disconnectDB();
    process.exit(0);
});

//middlewares
app.use(helmet()); // Set security headers
app.use(cors(corsOptions)); // Enable CORS
app.use(json()); // Parse JSON bodies
app.use(urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookie headers
app.use(compression()); // Compress response bodies
app.use(morgan('dev')); // Log HTTP requests
app.use(rateLimiter); // Rate limiting

// Routes
setupSwagger(app);
app.use('/api', appRouter)
app.use('/health', async (_, res) => {
    const isDBConnected = await checkDBConnection();
    if (!isDBConnected) {
        res.status(503).json({
            message: 'Service unavailable',
        })
    } else {
        res.json({
            message: 'OK👌',
        });
    }
});

// Error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
