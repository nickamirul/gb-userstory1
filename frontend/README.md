# Math Calculator Frontend

A modern React-based math calculator application that integrates with a Node.js backend API. Built with Vite, TailwindCSS, and modern web technologies.

## Features


### 🧮 Calculator Functionality
- Real-time expression validation
- Support for basic arithmetic operations: `+`, `-`, `*`, `/`
- Proper operator precedence (multiplication and division before addition and subtraction)
- Parentheses support for complex expressions
- Decimal number support

### 🔐 Security & API Integration
- Secure API key authentication
- RESTful API communication with backend
- Comprehensive error handling
- Connection status monitoring

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
- Backend server running on `http://localhost:3001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the backend API using the following configuration:

- **Base URL**: `http://localhost:3001`
- **API Key**: `gb-math-calculator-2024-secure-key`
- **Endpoints**:
  - `POST /api/v1/calculate` - Calculate mathematical expressions

### Request Format

```javascript
POST /api/v1/calculate
Headers: {
  "Content-Type": "application/json",
  "X-API-Key": "gb-math-calculator-2024-secure-key"
}
Body: {
  "expression": "2 + 3 * 4"
}
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
src/
├── components/
│   └── Calculator.jsx       # Main calculator component
├── services/
│   └── api.js              # API service and utilities
├── utils/
│   └── index.js            # Utility functions
├── App.jsx                 # Main app component
├── main.jsx               # Application entry point
└── index.css              # Global styles with TailwindCSS
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
- API endpoint and key are configurable in `src/services/api.js`
- TailwindCSS configuration in `tailwind.config.js`
- Build configuration in `vite.config.js`

### Local Storage
- Calculation history is automatically saved to localStorage
- Maximum of 50 historical calculations are retained
- Data persists across browser sessions

### Error Handling
- Comprehensive error handling for network, API, and validation errors
- User-friendly error messages with helpful suggestions
- Graceful degradation when backend is unavailable


