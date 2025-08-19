// Rate Limiting Middleware - Protects API endpoints from excessive requests
const rateLimit = require('express-rate-limit');

// Create rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: '15 minutes'
    });
  }
});

// Stricter rate limiter for calculation endpoint
const calculationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 calculations per minute
  message: {
    success: false,
    error: 'Too many calculation requests, please slow down.',
    code: 'CALCULATION_RATE_LIMIT_EXCEEDED',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many calculation requests, please slow down.',
      code: 'CALCULATION_RATE_LIMIT_EXCEEDED',
      retryAfter: '1 minute'
    });
  }
});

module.exports = {
  apiLimiter,
  calculationLimiter
};
