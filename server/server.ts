import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import 'dotenv/config';
import express from 'express';
import path from 'path';
import applicationsRouter from './routes/applications';
import authRoutes from './routes/auth';

//create the Express application
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://interntrack-pro.vercel.app', //main URL
        'https://interntrack-ffq7244bd-marys-projects-8f62ceb8.vercel.app' //branch URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//Middleware - parse incoming JSON request
app.use(express.json());
app.use('/api/applications', applicationsRouter);
app.use('/api/auth', authRoutes);

// Swagger documentation
const swaggerDocument = YAML.load(
    path.join(__dirname, 'swagger.yaml')
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});

//Health check-confirms API is running
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'InternTrack Pro API is running',
    });
});
//Start listening for requests
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);

}).on('error', (err) => {
    console.error('Server error:', err);
});