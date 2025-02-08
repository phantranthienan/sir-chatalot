import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation for my application',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Change this to your deployed URL in production
                description: 'Development server',
            },
        ],
    },
    apis: ['src/routes/*.ts'], // Path to API route files
};

// Initialize Swagger docs
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Function to setup Swagger UI in the app
export const setupSwagger = (app: Express) => {
    app.use('/api-document', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('✅ Swagger API docs available at http://localhost:3000/api-document');
};
