import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: 'An error occurred',
      code: 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
    };

    if (error.response?.data) {
      customError.message = error.response.data.error || error.response.data.message || customError.message;
      customError.code = error.response.data.code || customError.code;
    } else if (error.request) {
      customError.message = 'Unable to connect to the server. Please check if the backend is running.';
      customError.code = 'CONNECTION_ERROR';
    } else {
      customError.message = error.message || customError.message;
    }

    return Promise.reject(customError);
  }
);

// Calculator API Service
export const calculatorAPI = {
  // Calculate mathematical expression
  async calculate(expression) {
    if (!expression || typeof expression !== 'string') {
      throw {
        message: 'Expression must be a non-empty string',
        code: 'INVALID_INPUT',
        status: 400,
      };
    }

    const response = await apiClient.post('/api/v1/calculate', {
      expression: expression.trim(),
    });

    return response.data;
  },

  // Check backend server health
  async checkHealth() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/health`, {
        timeout: 3000, // 3 second timeout for health check
      });
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  },
};

// Utility functions for validation
export const validationUtils = {
  // Validate mathematical expression format
  validateExpression(expression) {
    if (!expression || typeof expression !== 'string') {
      return {
        isValid: false,
        message: 'Expression must be a non-empty string',
      };
    }

    const trimmed = expression.trim();
    
    if (trimmed === '') {
      return {
        isValid: false,
        message: 'Expression cannot be empty',
      };
    }

    // Check for valid characters (numbers, operators, parentheses, decimal points, spaces)
    const validPattern = /^[\d+\-*/(). ]+$/;
    if (!validPattern.test(trimmed)) {
      return {
        isValid: false,
        message: 'Expression contains invalid characters. Only numbers, +, -, *, /, (, ), and . are allowed.',
      };
    }

    // Check for obvious syntax errors
    const invalidPatterns = [
      { pattern: /[+\-*/]{2,}/, message: 'Multiple consecutive operators are not allowed' },
      { pattern: /^[+*/]/, message: 'Expression cannot start with *, /, or +' },
      { pattern: /[+\-*/]$/, message: 'Expression cannot end with an operator' },
      { pattern: /\(\)/, message: 'Empty parentheses are not allowed' },
      { pattern: /\d+\.\d*\./, message: 'Invalid decimal number format' },
    ];

    for (const { pattern, message } of invalidPatterns) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          message,
        };
      }
    }

    return {
      isValid: true,
      message: 'Expression is valid',
    };
  },

  // Format error message for user display
  formatErrorMessage(error) {
    const errorMessages = {
      CONNECTION_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
      MISSING_API_KEY: 'Authentication error. Please contact support.',
      INVALID_API_KEY: 'Authentication failed. Please contact support.',
      DIVISION_BY_ZERO: 'Division by zero is not allowed.',
      INVALID_CHARACTER: 'Your expression contains invalid characters. Please use only numbers and operators (+, -, *, /, parentheses).',
      MISMATCHED_PARENTHESES: 'Parentheses are not properly matched. Please check your expression.',
      INVALID_EXPRESSION_FORMAT: 'Invalid expression format. Please check your math expression.',
      CALCULATION_ERROR: 'Error calculating your expression. Please check the format and try again.',
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred. Please try again.';
  },
};

export default calculatorAPI;
