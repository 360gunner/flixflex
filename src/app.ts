import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import authRoutes from './routes/authRoutes';
import authMiddleware from './middleware/authMiddleware';

dotenv.config();
connectDB();

const app: Express = express();
const PORT: string | number = process.env.PORT || 3000;

app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FlixFlex API Documentation',
      version: '1.0.0',
      description: 'This is a REST API for the FlixFlex movie application',
    },
    components: {
      schemas: {
        ContentType: {
          type: 'string',
          enum: ['movie', 'tv'],
          description: "Content type can be either 'movie' or 'tv'",
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ 
      bearerAuth: [],
    }],
  },
  apis: ['./src/routes/*.ts'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('FlixFlex API is running...');
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


export default app;