import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const defaultOrigins = ['http://localhost:5173', 'http://localhost:5174'];
const envOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, docker healthchecks)
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

// Health check endpoint for Docker and monitoring
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Route declarations
import userRouter from './routes/user.routes.js';
app.use('/api/v1/users', userRouter);

import adminRouter from './routes/admin.routes.js';
app.use('/api/v1/admins', adminRouter);

export { app };
