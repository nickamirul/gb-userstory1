# Math Calculator Frontend

A modern React-based math calculator application that integrates with a Node.js HTTPS backend API. Built with Vite, TailwindCSS, and modern web technologies with SSL/TLS encryption for secure communication.

## Features


### 🧮 Calculator Functionality
- Real-time expression validation
- Support for basic arithmetic operations: `+`, `-`, `*`, `/`
- Proper operator precedence (multiplication and division before addition and subtraction)
- Parentheses support for complex expressions
- Decimal number support

### 🔐 Security & API Integration
- 🔒 HTTPS/TLS encrypted communication
- 🛡️ SSL certificate support for secure local development
- 🔑 Secure API key authentication
- 🌐 RESTful HTTPS API communication with backend
- ✅ Comprehensive error handling
- 📊 Connection status monitoring

### 📊 Additional Features
- Calculation history with local storage
- Copy results to clipboard
- Real-time input validation
- Loading states and error messages
- Offline detection
- Backend connection monitoring

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS v3.4.17
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- **HTTPS Backend server** running on `https://localhost:3001`
- **SSL certificates** (generated via mkcert for local development)

## 🔒 HTTPS Setup

This frontend application uses HTTPS for secure communication with the backend.

### Prerequisites for HTTPS

1. **SSL Certificates** (from project root):
   ```bash
   # Install mkcert (if not already done)
   brew install mkcert
   mkcert -install
   
   # Generate certificates (run from project root)
   mkdir -p certs
   mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
   ```

2. **Create `.env` file**:
   ```bash
   # Create .env file in frontend directory
   cat > .env << EOF
   VITE_API_BASE_URL=https://localhost:3001
   VITE_API_KEY=math-calculator-api-key
   EOF
   ```

### SSL Certificate Configuration

The frontend Vite server is configured to use SSL certificates from:
- **Certificate**: `../certs/localhost.pem`
- **Private Key**: `../certs/localhost-key.pem`

This configuration is defined in `vite.config.js`.

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Setup HTTPS certificates** (see HTTPS Setup section above)

3. **Create `.env` file** (see HTTPS Setup section above)

4. **Start the development server**:
   ```bash
   npm run dev
   ```

The application will be available at `https://localhost:5173` with SSL encryption.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the backend HTTPS API using the following configuration:

- **Base URL**: `https://localhost:3001`
- **API Key**: `math-calculator-api-key`
- **Protocol**: HTTPS with SSL/TLS encryption
- **Endpoints**:
  - `POST /api/v1/calculate` - Calculate mathematical expressions
  - `GET /api/v1/health` - Health check

### Request Format

```javascript
POST https://localhost:3001/api/v1/calculate
Headers: {
  "Content-Type": "application/json",
  "X-API-Key": "math-calculator-api-key"
}
Body: {
  "expression": "2 + 3 * 4"
}
```

### Environment Configuration

The API configuration is managed through:
1. **Primary**: `.env` file (environment variables)
2. **Fallback**: `src/config/https.config.js` (if .env is missing)

**.env file**:
```env
VITE_API_BASE_URL=https://localhost:3001
VITE_API_KEY=math-calculator-api-key
```

### Response Format

```javascript
// Success
{
  "success": true,
  "expression": "2 + 3 * 4",
  "result": 14,
  "timestamp": "2024-01-01T12:00:00.000Z"
}

// Error
{
  "success": false,
  "error": "Division by zero is not allowed",
  "code": "DIVISION_BY_ZERO",
  "expression": "5 / 0"
}
```

## Project Structure

```
frontend/
├── .env                    # Environment variables (git-ignored)
├── src/
│   ├── components/
│   │   └── Calculator.jsx  # Main calculator component
│   ├── config/
│   │   └── https.config.js # HTTPS fallback configuration
│   ├── services/
│   │   └── api.js         # API service and utilities with HTTPS support
│   ├── utils/
│   │   └── index.js       # Utility functions
│   ├── App.jsx            # Main app component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles with TailwindCSS
├── vite.config.js         # Vite configuration with HTTPS setup
└── package.json           # Dependencies and scripts
```

### SSL Certificate Structure (shared with backend)
```
../certs/                  # SSL certificates (git-ignored)
├── localhost.pem          # SSL certificate file
└── localhost-key.pem      # Private key file
```

## Testing

### Positive Test Cases

1. **Basic arithmetic**: `2 + 3` → `5`
2. **Operator precedence**: `2 + 3 * 4` → `14`
3. **Parentheses**: `(2 + 3) * 4` → `20`
4. **Decimal numbers**: `3.14 + 2.86` → `6`
5. **Complex expression**: `((2 + 3) * 4) / 2` → `10`

### Negative Test Cases

1. **Division by zero**: `5 / 0` → Error: "Division by zero is not allowed"
2. **Invalid characters**: `2 + a` → Error: "Expression contains invalid characters"
3. **Mismatched parentheses**: `2 + (3 * 4` → Error: "Mismatched parentheses"
4. **Empty expression**: `` → Error: "Expression cannot be empty"
5. **Invalid operators**: `2 ++ 3` → Error: "Multiple consecutive operators are not allowed"

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support with proper tab order
- **Screen Reader Support**: ARIA labels and descriptions
- **High Contrast**: Accessible color combinations
- **Focus Management**: Clear focus indicators
- **Error Announcements**: Screen reader friendly error messages

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Notes

### Configuration
- **HTTPS Setup**: SSL certificates configured in `vite.config.js`
- **API Configuration**: Managed via `.env` file and `src/config/https.config.js` fallback
- **Environment Variables**: Primary configuration through `.env` file
- **TailwindCSS**: Styling configuration in `tailwind.config.js`
- **Build Configuration**: Vite setup with HTTPS support in `vite.config.js`

### Local Storage
- Calculation history is automatically saved to localStorage
- Maximum of 50 historical calculations are retained
- Data persists across browser sessions

### Error Handling
- Comprehensive error handling for network, API, and validation errors
- User-friendly error messages with helpful suggestions
- Graceful degradation when backend is unavailable


