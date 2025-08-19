// Authentication Middleware - Handles API key authentication for protected routes
const config = require('../config');

// API Key Authentication Middleware - Validates the API key from request headers
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required. Please provide X-API-Key header.',
      code: 'MISSING_API_KEY'
    });
  }
  
  // Remove 'Bearer ' prefix if present
  const cleanApiKey = apiKey.replace(/^Bearer\s+/i, '');
  
  if (cleanApiKey !== config.apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key. Access denied.',
      code: 'INVALID_API_KEY'
    });
  }
  
  next();
};

module.exports = {
  authenticateApiKey
};
