import express from 'express';
import path from 'path';

//create the Express application
const app = express();
const PORT = process.env.PORT || 3000;

//Middleware - parse incoming JSON request
app.use(express.json());

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

})