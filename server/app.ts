import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import applicationsRouter from './routes/applications';
import authRouter from './routes/auth';

const app = express();

// CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://interntrack-pro.vercel.app',
        'https://interntrack-ffq7244bd-marys-projects-8f62ceb8.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());

// Swagger docs
const swaggerDocument = YAML.load(
    path.join(__dirname, 'swagger.yaml')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/applications', applicationsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'InternTrack Pro API is running' });
});

export default app;