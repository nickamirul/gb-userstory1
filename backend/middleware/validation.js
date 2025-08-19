// Input Validation Middleware - Handles validation for incoming requests

// Input validation middleware for math calculations
const validateMathInput = (req, res, next) => {
  const { expression } = req.body;
  
  if (!expression) {
    return res.status(400).json({
      success: false,
      error: 'Math expression is required in request body.',
      code: 'MISSING_EXPRESSION'
    });
  }
  
  if (typeof expression !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Expression must be a string.',
      code: 'INVALID_EXPRESSION_TYPE'
    });
  }
  
  if (expression.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Expression cannot be empty.',
      code: 'EMPTY_EXPRESSION'
    });
  }
  
  if (expression.length > 1000) {
    return res.status(400).json({
      success: false,
      error: 'Expression is too long (max 1000 characters).',
      code: 'EXPRESSION_TOO_LONG'
    });
  }
  
  next();
};

module.exports = {
  validateMathInput
};
