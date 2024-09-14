import 'dotenv/config';
import express from 'express';
import connectDB from './database/config.js';
import clientRoutes from './routes/clientRoutes.js';
import userRoutes from './routes/userRoutes.js';
import accountRoutes from './routes/accountRoutes.js';


const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define routes
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/accounts', accountRoutes);

// Start server function
const startServer = () => {
    connectDB();  // Connect to MongoDB
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

// Export the startServer function
export default startServer;

