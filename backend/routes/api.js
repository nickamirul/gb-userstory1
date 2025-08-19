// API Routes - Math calculation and API information endpoints

const express = require('express');
const router = express.Router();
const { authenticateApiKey, validateMathInput } = require('../middleware');
const MathParser = require('../utils/mathParser');

const mathParser = new MathParser();

// Math calculation endpoint - POST /api/v1/calculate
router.post('/calculate', authenticateApiKey, validateMathInput, (req, res) => {
  try {
    const { expression } = req.body;
    
    console.log(`Calculating expression: ${expression}`);
    
    // Calculate the result using the math parser
    const result = mathParser.calculate(expression);
    
    console.log(`Result: ${result}`);
    
    res.json({
      success: true,
      expression: expression.trim(),
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Calculation error:', error.message);
    
    // Determine appropriate status code based on error type
    let statusCode = 400;
    let errorCode = 'CALCULATION_ERROR';
    
    if (error.message.includes('Division by zero')) {
      errorCode = 'DIVISION_BY_ZERO';
    } else if (error.message.includes('Invalid character')) {
      errorCode = 'INVALID_CHARACTER';
    } else if (error.message.includes('Mismatched parentheses')) {
      errorCode = 'MISMATCHED_PARENTHESES';
    } else if (error.message.includes('insufficient operands') || error.message.includes('too many operands')) {
      errorCode = 'INVALID_EXPRESSION_FORMAT';
    }
    
    res.status(statusCode).json({
      success: false,
      error: error.message,
      code: errorCode,
      expression: req.body.expression
    });
  }
});

module.exports = router;
