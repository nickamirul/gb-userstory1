# Math Calculator Backend

A robust Node.js/Express backend server for performing mathematical calculations with API key authentication.

## Project Description

This backend server provides a secure REST API for mathematical calculations with proper operator precedence handling. It supports basic arithmetic operations (+, -, *, /) with multiplication and division having higher precedence than addition and subtraction. The server includes comprehensive input validation, error handling, and API key authentication for secure access.

## Features

- ✅ **Mathematical Operations**: Addition (+), Subtraction (-), Multiplication (*), Division (/)
- ✅ **Operator Precedence**: *, / have higher precedence over +, -
- ✅ **Parentheses Support**: Override operator precedence with parentheses
- ✅ **Decimal Numbers**: Support for floating-point calculations
- ✅ **API Key Authentication**: Secure endpoint access with API key validation
- ✅ **Input Validation**: Comprehensive validation and sanitization
- ✅ **Error Handling**: Detailed error messages with appropriate HTTP status codes
- ✅ **CORS Support**: Cross-origin resource sharing for frontend integration
- ✅ **Security Headers**: Helmet.js for enhanced security

## API Endpoints

### Calculate Expression
```
POST /api/v1/calculate
Headers: X-API-Key: your-api-key
Content-Type: application/json

Body:
{
  "expression": "2 + 3 * 4"
}
```

## Authentication

All API endpoints require an API key in the request headers:

```
X-API-Key: math-calculator-api-key
```

Or alternatively:
```
Authorization: math-calculator-api-key
```

## Installation and Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Start Production Server**:
   ```bash
   npm start
   ```

4. **Run Tests**:
   ```bash
   npm test
   ```

## Test Cases

### Positive Test Cases

1. **Simple Addition**: `2 + 3` → `5`
2. **Simple Subtraction**: `10 - 4` → `6`
3. **Simple Multiplication**: `3 * 4` → `12`
4. **Simple Division**: `15 / 3` → `5`
5. **Operator Precedence**: `2 + 3 * 4` → `14` (multiplication first)
6. **Parentheses Override**: `(2 + 3) * 4` → `20`
7. **Division Before Addition**: `10 / 2 + 3` → `8`
8. **Decimal Numbers**: `2.5 + 1.5` → `4`
9. **Multiple Operations**: `100 - 50 + 25` → `75`
10. **Complex Expression**: `2 * 3 + 4 * 5` → `26`

### Negative Test Cases

1. **Division by Zero**: `5 / 0` → Error: "Division by zero is not allowed"
2. **Incomplete Expression**: `2 +` → Error: "Invalid expression"
3. **Starting with Operator**: `+ 3` → Error: "Invalid expression"
4. **Mismatched Parentheses**: `(2 + 3` → Error: "Mismatched parentheses"
5. **Extra Parenthesis**: `2 + 3)` → Error: "Mismatched parentheses"
6. **Unsupported Operator**: `2 ** 3` → Error: "Invalid character"
7. **Invalid Character**: `2 & 3` → Error: "Invalid character"
8. **Empty Expression**: `""` → Error: "Expression cannot be empty"
9. **Whitespace Only**: `"   "` → Error: "Expression cannot be empty"
10. **Invalid Number Format**: `2..5 + 3` → Error: "Invalid character"

## API Response Format

### Success Response
```json
{
  "success": true,
  "expression": "2 + 3 * 4",
  "result": 14,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Division by zero is not allowed",
  "code": "DIVISION_BY_ZERO",
  "expression": "5 / 0"
}
```

## Error Codes

- `MISSING_API_KEY`: API key not provided
- `INVALID_API_KEY`: Invalid API key
- `MISSING_EXPRESSION`: Math expression not provided
- `INVALID_EXPRESSION_TYPE`: Expression is not a string
- `EMPTY_EXPRESSION`: Expression is empty
- `EXPRESSION_TOO_LONG`: Expression exceeds maximum length
- `DIVISION_BY_ZERO`: Attempt to divide by zero
- `INVALID_CHARACTER`: Expression contains invalid characters
- `MISMATCHED_PARENTHESES`: Parentheses are not properly matched
- `INVALID_EXPRESSION_FORMAT`: Expression format is invalid
- `CALCULATION_ERROR`: Generic calculation error
- `NOT_FOUND`: Endpoint not found
- `INTERNAL_ERROR`: Internal server error

## Configuration

The server can be configured using the following environment variables:

- `PORT`: Server port (default: 3001)
- `API_KEY`: API key for authentication (default: math-calculator-api-key)
- `NODE_ENV`: Environment mode (default: development)

## Security Features

1. **API Key Authentication**: Protects endpoints from unauthorized access
2. **Input Validation**: Prevents malicious input and injection attacks
3. **Rate Limiting**: Configurable request rate limiting
4. **CORS Configuration**: Controlled cross-origin access
5. **Security Headers**: Helmet.js provides security headers
6. **Error Handling**: Prevents information leakage through error messages

## Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing
- **Custom Math Parser**: Implements Shunting Yard algorithm for operator precedence

## Architecture

The backend follows a modular architecture:

```
backend/
├── config.js              # Configuration management
├── middleware/
│   ├── auth.js            # API key authentication middleware
│   ├── index.js           # Middleware exports
│   ├── logging.js         # Request logging middleware
│   ├── rateLimit.js       # Rate limiting middleware
│   └── validation.js      # Input validation middleware
├── package.json           # Dependencies and scripts
├── README.md              # Documentation
├── routes/
│   ├── api.js            # API calculation endpoints
│   └── index.js          # Route management and 404 handler
├── server.js             # Main server file with Express setup
├── test.js               # Test cases and validation
└── utils/
    └── mathParser.js     # Mathematical expression parser
```
