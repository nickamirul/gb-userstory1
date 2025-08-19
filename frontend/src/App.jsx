import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Shield, AlertTriangle } from 'lucide-react';
import Calculator from './components/Calculator';
import { calculatorAPI } from './services/api';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('checking');

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const isHealthy = await calculatorAPI.checkHealth();
      setConnectionStatus(isHealthy ? 'connected' : 'offline');
    } catch {
      setConnectionStatus('offline');
    }
  };

  // Initial health check and periodic checks
  useEffect(() => {
    // Check immediately on mount
    checkBackendHealth();
    
    // Check every 10 seconds
    const healthCheckInterval = setInterval(checkBackendHealth, 10000);
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, []);

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <div className="flex items-center space-x-2 text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Backend Online</span>
          </div>
        );
      case 'offline':
        return (
          <div className="flex items-center space-x-2 text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Backend Offline</span>
          </div>
        );
      case 'checking':
        return (
          <div className="flex items-center space-x-2 text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Checking...</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-primary-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Math Calculator
                </h1>
                <p className="text-xs text-gray-500">
                  Secure API-powered calculations
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {getConnectionBadge()}
            </div>
          </div>
        </div>
      </header>

      {/* Connection Warning */}
      {connectionStatus === 'offline' && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center space-x-3 text-red-800">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-medium">Backend Server Offline</p>
                <p className="text-sm text-red-600">
                  The calculator backend server is not running. Please start the server to perform calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Calculator />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© 2025 Amirul Ismail</span>
              <span>•</span>
              <span>API v1.0.0</span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Supported operators:</span>
              {['+', '-', '*', '/'].map((op) => (
                <span
                  key={op}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-mono"
                >
                  {op}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-100">
            <details className="group">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800 transition-colors">
                <span className="select-none">Features & Capabilities</span>
              </summary>
              <div className="mt-2 pl-4">
                <ul className="text-sm text-gray-600 space-y-1">
                  {[
                    'Basic arithmetic operations',
                    'Operator precedence support',
                    'Parentheses support',
                    'Decimal number support',
                    'API key authentication'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
