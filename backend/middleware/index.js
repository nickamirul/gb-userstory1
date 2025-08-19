// Middleware Index - Exports all middleware functions for easy importing

const { authenticateApiKey } = require('./auth');
const { validateMathInput } = require('./validation');
const { requestLogger } = require('./logging');

module.exports = {
  authenticateApiKey,
  validateMathInput,
  requestLogger
};
