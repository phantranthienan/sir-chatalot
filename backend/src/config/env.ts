import dotenv from 'dotenv';
import path from 'path';

// const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
// dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

dotenv.config();

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    CORS_ORIGIN: (process.env.CORS_ORIGIN || '').split(','),
    FRONTEND_URL: process.env.FRONTEND_URL,
    //jwt
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    //nodemailer
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS,
    //cloundinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

const requiredVariables = ['MONGO_URI', 'ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'GMAIL_USER', 'GMAIL_PASS'];
requiredVariables.forEach((variable) => {
    if (!ENV[variable as keyof typeof ENV]) {
        console.error(`Missing required env variable ${variable}`);
        process.exit(1);
    }
});