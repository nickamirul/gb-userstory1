import React, { useState, useEffect, useRef } from 'react';
import { Calculator as CalculatorIcon, History, Trash2, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { calculatorAPI, validationUtils } from '../services/api';
import { cn, formatTime, formatNumber, generateId, copyToClipboard, storage } from '../utils';

const Calculator = () => {
  // State management
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Refs
  const inputRef = useRef(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = storage.get('calculator-history', []);
    setHistory(savedHistory);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    storage.set('calculator-history', history);
  }, [history]);

  // Handle input changes with validation
  const handleInputChange = (e) => {
    const value = e.target.value;
    setExpression(value);
    setError('');
    setValidationError('');
    
    // Real-time validation (non-blocking)
    if (value.trim()) {
      const validation = validationUtils.validateExpression(value);
      if (!validation.isValid) {
        setValidationError(validation.message);
      }
    }
  };

  // Handle calculation
  const handleCalculate = async () => {
    if (!expression.trim()) {
      setError('Please enter a mathematical expression');
      inputRef.current?.focus();
      return;
    }

    // Validate expression before sending
    const validation = validationUtils.validateExpression(expression);
    if (!validation.isValid) {
      setError(validation.message);
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');
    setValidationError('');

    try {
      const response = await calculatorAPI.calculate(expression);
      
      if (response.success) {
        const formattedResult = formatNumber(response.result);
        setResult(formattedResult);
        
        // Add to history
        const historyItem = {
          id: generateId(),
          expression: response.expression,
          result: response.result,
          formattedResult,
          timestamp: new Date().toISOString(),
        };
        
        setHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50 items
      } else {
        setError(response.error || 'Calculation failed');
      }
    } catch (error) {
      const errorMessage = validationUtils.formatErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleCalculate();
    }
  };

  // Clear all
  const handleClear = () => {
    setExpression('');
    setResult('');
    setError('');
    setValidationError('');
    inputRef.current?.focus();
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    storage.remove('calculator-history');
  };

  // Copy result to clipboard
  const handleCopyResult = async () => {
    if (!result) return;
    
    const success = await copyToClipboard(result);
    if (success) {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  // Use expression from history
  const loadFromHistory = (item) => {
    setExpression(item.expression);
    setResult(item.formattedResult);
    setError('');
    setValidationError('');
    setShowHistory(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-3">
          <CalculatorIcon className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Math Calculator</h1>
        </div>
        <p className="text-gray-600">
          Supports +, -, *, / with proper precedence and parentheses
        </p>
      </div>

      {/* Main Calculator */}
      <div className="card max-w-2xl mx-auto space-y-6">
        {/* Input Section */}
        <div className="space-y-3">
          <label htmlFor="expression" className="block text-sm font-medium text-gray-700">
            Mathematical Expression
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              id="expression"
              type="text"
              value={expression}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your calculation (e.g., 2 + 3 * 4)"
              className={cn(
                'input-field',
                (error || validationError) && 'border-red-300 focus:ring-red-500',
                validationError && !error && 'border-yellow-300 focus:ring-yellow-500'
              )}
              disabled={isLoading}
              aria-describedby={error ? 'error-message' : validationError ? 'validation-message' : undefined}
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
              </div>
            )}
          </div>
          
          {/* Validation Warning */}
          {validationError && !error && (
            <div id="validation-message" className="flex items-start space-x-2 text-yellow-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{validationError}</span>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div id="error-message" className="flex items-start space-x-2 text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCalculate}
            disabled={isLoading || !expression.trim()}
            className={cn(
              'btn-primary flex-1 min-w-0',
              (isLoading || !expression.trim()) && 'opacity-50 cursor-not-allowed'
            )}
            aria-label="Calculate expression"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate'
            )}
          </button>
          
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="btn-secondary"
            aria-label="Clear input"
          >
            Clear
          </button>
          
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              'btn-secondary flex items-center space-x-2',
              showHistory && 'bg-primary-100 text-primary-700 border-primary-200'
            )}
            aria-label="Toggle calculation history"
          >
            <History className="w-5 h-5" />
            <span>History</span>
            {history.length > 0 && (
              <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className="space-y-2 animate-slide-up">
            <label className="block text-sm font-medium text-gray-700">
              Result
            </label>
            <div className="relative">
              <div className="result-display">
                {result}
              </div>
              <button
                onClick={handleCopyResult}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Copy result to clipboard"
              >
                {copySuccess ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            {copySuccess && (
              <p className="text-green-600 text-sm animate-fade-in">{copySuccess}</p>
            )}
          </div>
        )}
      </div>

      {/* History Panel */}
      {showHistory && (
        <div className="card max-w-2xl mx-auto animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Calculation History</h3>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-red-600 hover:text-red-700 flex items-center space-x-1 text-sm transition-colors"
                aria-label="Clear all history"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No calculations yet</p>
              <p className="text-sm">Your calculation history will appear here</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => loadFromHistory(item)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      loadFromHistory(item);
                    }
                  }}
                  aria-label={`Use calculation: ${item.expression} equals ${item.formattedResult}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-gray-700 truncate">
                        {item.expression}
                      </span>
                      <span className="text-gray-400">=</span>
                      <span className="font-mono font-semibold text-gray-900 truncate">
                        {item.formattedResult}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(item.timestamp)}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-primary-600">Click to use</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;
