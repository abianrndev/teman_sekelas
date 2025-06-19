const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enhanced CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Authorization']
}));

// Preflight requests
// app.options('*', cors());

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
const authRoutes = require('./routes/auth');
const summaryRoutes = require('./routes/summaries');
const commentRoutes = require('./routes/comments');

app.use('/api/auth', authRoutes);
app.use('/summaries', summaryRoutes);
app.use('/api/comments', commentRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(`[ERROR] ${err.stack}`);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Available routes:');
    console.log('- POST /api/auth/login');
    console.log('- POST /api/auth/register');
    console.log('- GET  /api/auth/me');
    console.log('- PUT  /api/auth/profile');
    console.log('- POST /api/auth/upload-avatar');
});