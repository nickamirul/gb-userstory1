class MathParser {
  constructor() {
    this.operators = {
      '+': { precedence: 1, associativity: 'left' },
      '-': { precedence: 1, associativity: 'left' },
      '*': { precedence: 2, associativity: 'left' },
      '/': { precedence: 2, associativity: 'left' }
    };
  }

  // Validates if the expression contains only allowed characters
  isValidExpression(expression) {
    // Only allow digits, operators, parentheses, whitespace, and decimal points
    const allowedPattern = /^[\d+\-*/().\s]+$/;
    return allowedPattern.test(expression);
  }

  // Validates if a number string is properly formatted
  isValidNumber(numberStr) {
    // Check for multiple decimal points
    const decimalCount = (numberStr.match(/\./g) || []).length;
    if (decimalCount > 1) return false;
    
    // Check if it's a valid number format
    const numberRegex = /^\d*\.?\d+$/;
    return numberRegex.test(numberStr);
  }

  // Tokenizes the expression into numbers and operators
  tokenize(expression) {
    const tokens = [];
    let currentNumber = '';
    
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      
      if (char === ' ') {
        continue; // Skip whitespace
      }
      
      if (char >= '0' && char <= '9' || char === '.') {
        currentNumber += char;
      } else if (this.operators[char]) {
        if (currentNumber) {
          if (!this.isValidNumber(currentNumber)) {
            throw new Error(`Invalid number format: ${currentNumber}`);
          }
          tokens.push(parseFloat(currentNumber));
          currentNumber = '';
        }
        tokens.push(char);
      } else if (char === '(' || char === ')') {
        if (currentNumber) {
          if (!this.isValidNumber(currentNumber)) {
            throw new Error(`Invalid number format: ${currentNumber}`);
          }
          tokens.push(parseFloat(currentNumber));
          currentNumber = '';
        }
        tokens.push(char);
      } else {
        throw new Error(`Invalid character: ${char}`);
      }
    }
    
    if (currentNumber) {
      if (!this.isValidNumber(currentNumber)) {
        throw new Error(`Invalid number format: ${currentNumber}`);
      }
      tokens.push(parseFloat(currentNumber));
    }
    
    return tokens;
  }

  // Converts infix notation to postfix notation using Shunting Yard algorithm
  infixToPostfix(tokens) {
    const output = [];
    const operatorStack = [];
    
    for (const token of tokens) {
      if (typeof token === 'number') {
        output.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          output.push(operatorStack.pop());
        }
        if (operatorStack.length === 0) {
          throw new Error('Mismatched parentheses');
        }
        operatorStack.pop(); // Remove the '('
      } else if (this.operators[token]) {
        const o1 = this.operators[token];
        
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1] !== '(' &&
          this.operators[operatorStack[operatorStack.length - 1]] &&
          (this.operators[operatorStack[operatorStack.length - 1]].precedence > o1.precedence ||
           (this.operators[operatorStack[operatorStack.length - 1]].precedence === o1.precedence &&
            o1.associativity === 'left'))
        ) {
          output.push(operatorStack.pop());
        }
        
        operatorStack.push(token);
      }
    }
    
    while (operatorStack.length > 0) {
      const operator = operatorStack.pop();
      if (operator === '(' || operator === ')') {
        throw new Error('Mismatched parentheses');
      }
      output.push(operator);
    }
    
    return output;
  }

  // Evaluates postfix notation
  evaluatePostfix(postfix) {
    const stack = [];
    
    for (const token of postfix) {
      if (typeof token === 'number') {
        stack.push(token);
      } else if (this.operators[token]) {
        if (stack.length < 2) {
          throw new Error('Invalid expression: insufficient operands');
        }
        
        const b = stack.pop();
        const a = stack.pop();
        
        let result;
        switch (token) {
          case '+':
            result = a + b;
            break;
          case '-':
            result = a - b;
            break;
          case '*':
            result = a * b;
            break;
          case '/':
            if (b === 0) {
              throw new Error('Division by zero is not allowed');
            }
            result = a / b;
            break;
          default:
            throw new Error(`Unknown operator: ${token}`);
        }
        
        stack.push(result);
      }
    }
    
    if (stack.length !== 1) {
      throw new Error('Invalid expression: too many operands');
    }
    
    return stack[0];
  }

  // Main method to calculate a math expression
  calculate(expression) {
    if (!expression || typeof expression !== 'string') {
      throw new Error('Expression must be a non-empty string');
    }
    
    // Remove all whitespace for easier processing
    const cleanExpression = expression.replace(/\s+/g, '');
    
    if (cleanExpression === '') {
      throw new Error('Expression cannot be empty');
    }
    
    // Validate expression
    if (!this.isValidExpression(cleanExpression)) {
      throw new Error('Expression contains invalid characters');
    }
    
    // Tokenize the expression
    const tokens = this.tokenize(cleanExpression);
    
    if (tokens.length === 0) {
      throw new Error('No valid tokens found in expression');
    }
    
    // Convert to postfix notation
    const postfix = this.infixToPostfix(tokens);
    
    // Evaluate postfix notation
    const result = this.evaluatePostfix(postfix);
    
    // Check for invalid results
    if (!isFinite(result)) {
      throw new Error('Calculation resulted in an invalid number');
    }
    
    return result;
  }
}

module.exports = MathParser;
