require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const config = require('./config');
const { requestLogger, apiLimiter } = require('./middleware');
const routes = require('./routes');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting middleware
app.use(apiLimiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://localhost:3000',
    'http://localhost:5173',  
    'https://localhost:5173',
    'http://localhost:5174',
    'https://localhost:5174',
    'http://127.0.0.1:5173',
    'https://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://127.0.0.1:5174'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// Mount all routes
app.use('/', routes);

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
});

// SSL Certificate configuration
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, '../certs/localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, '../certs/localhost.pem'))
};

// Start the HTTPS server
const PORT = config.port;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('Math Calculator Backend Server (HTTPS)');
  console.log('='.repeat(50));
  console.log(`Server running on port: ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`API Key configured: ${config.apiKey ? 'Yes' : 'No'}`);
  console.log('Available endpoints:');
  console.log(`  POST https://localhost:${PORT}/api/v1/calculate`);
  console.log('='.repeat(50));
});

module.exports = app;
