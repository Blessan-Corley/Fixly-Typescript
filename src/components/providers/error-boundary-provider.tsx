'use client';

import { Component, ReactNode, ErrorInfo, createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';

interface ErrorBoundaryContextType {
  reportError: (error: Error, errorInfo?: ErrorInfo) => void;
  clearError: () => void;
  errorHistory: ErrorLog[];
  isRecovering: boolean;
}

interface ErrorLog {
  id: string;
  error: Error;
  errorInfo?: ErrorInfo;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

interface ErrorBoundaryProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  maxRetries?: number;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | undefined>(undefined);

class ErrorBoundaryClass extends Component<
  ErrorBoundaryProviderProps,
  ErrorBoundaryState
> {
  private retryTimeoutId: NodeJS.Timeout | null = null;
  private errorHistory: ErrorLog[] = [];

  constructor(props: ErrorBoundaryProviderProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error
    this.logError(error, errorInfo);
    
    // Report to external service
    this.reportToService(error, errorInfo);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  private logError = (error: Error, errorInfo?: ErrorInfo) => {
    const errorLog: ErrorLog = {
      id: this.state.errorId || `error_${Date.now()}`,
      error,
      errorInfo,
      timestamp: new Date(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      url: typeof window !== 'undefined' ? window.location.href : '',
      severity: this.getSeverity(error),
    };
    
    this.errorHistory.push(errorLog);
    
    // Keep only last 50 errors
    if (this.errorHistory.length > 50) {
      this.errorHistory = this.errorHistory.slice(-50);
    }
    
    console.error('Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      errorInfo: errorInfo?.componentStack,
      ...errorLog,
    });
  };

  private reportToService = async (error: Error, errorInfo?: ErrorInfo) => {
    if (process.env.NODE_ENV !== 'production') return;
    
    try {
      await fetch('/api/errors/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo?.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          errorId: this.state.errorId,
        }),
      });
    } catch (reportingError) {
      console.error('Failed to report error to service:', reportingError);
    }
  };

  private getSeverity = (error: Error): 'low' | 'medium' | 'high' | 'critical' => {
    const errorMessage = error.message.toLowerCase();
    const errorStack = error.stack?.toLowerCase() || '';
    
    // Critical errors
    if (errorMessage.includes('security') || 
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('authentication')) {
      return 'critical';
    }
    
    // High severity errors
    if (errorMessage.includes('network') ||
        errorMessage.includes('server') ||
        errorMessage.includes('database') ||
        errorStack.includes('auth-provider') ||
        errorStack.includes('security-provider')) {
      return 'high';
    }
    
    // Medium severity errors
    if (errorMessage.includes('component') ||
        errorMessage.includes('render') ||
        errorMessage.includes('prop')) {
      return 'medium';
    }
    
    // Default to low
    return 'low';
  };

  private handleRetry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      console.warn('Maximum retry attempts reached');
      return;
    }
    
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorId: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
    
    // Auto-retry after delay for certain error types
    if (this.shouldAutoRetry()) {
      this.retryTimeoutId = setTimeout(() => {
        this.forceUpdate();
      }, Math.min(1000 * Math.pow(2, this.state.retryCount), 10000));
    }
  };

  private shouldAutoRetry = (): boolean => {
    if (!this.state.error) return false;
    
    const errorMessage = this.state.error.message.toLowerCase();
    return errorMessage.includes('network') || 
           errorMessage.includes('timeout') ||
           errorMessage.includes('connection');
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallback, enableRetry = true, maxRetries = 3 } = this.props;
      
      if (fallback) {
        return fallback;
      }
      
      return (
        <ErrorFallbackUI
          error={this.state.error}
          errorId={this.state.errorId}
          retryCount={this.state.retryCount}
          maxRetries={maxRetries}
          onRetry={enableRetry ? this.handleRetry : undefined}
          severity={this.state.error ? this.getSeverity(this.state.error) : 'medium'}
        />
      );
    }
    
    const contextValue: ErrorBoundaryContextType = {
      reportError: (error: Error, errorInfo?: ErrorInfo) => {
        this.logError(error, errorInfo);
        this.reportToService(error, errorInfo);
      },
      clearError: () => {
        this.setState({
          hasError: false,
          error: null,
          errorId: null,
          errorInfo: null,
          retryCount: 0,
        });
      },
      errorHistory: this.errorHistory,
      isRecovering: this.state.retryCount > 0 && !this.state.hasError,
    };
    
    return (
      <ErrorBoundaryContext.Provider value={contextValue}>
        {this.props.children}
      </ErrorBoundaryContext.Provider>
    );
  }
}

interface ErrorFallbackUIProps {
  error: Error | null;
  errorId: string | null;
  retryCount: number;
  maxRetries: number;
  onRetry?: () => void;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

function ErrorFallbackUI({ 
  error, 
  errorId, 
  retryCount, 
  maxRetries, 
  onRetry, 
  severity 
}: ErrorFallbackUIProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">{getSeverityIcon(severity)}</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Something went wrong
          </h1>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
            {severity.charAt(0).toUpperCase() + severity.slice(1)} Priority
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-slate-600 text-center">
            We've encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>

          {errorId && (
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">Error ID:</p>
              <code className="text-xs font-mono text-slate-800 break-all">{errorId}</code>
            </div>
          )}

          {onRetry && retryCount < maxRetries && (
            <button
              onClick={onRetry}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              {retryCount > 0 ? `Retry (${retryCount}/${maxRetries})` : 'Try Again'}
            </button>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>

          {error && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-slate-500 hover:text-slate-700 text-sm py-2 transition-colors"
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>
          )}

          {showDetails && error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-slate-900 rounded-lg p-4 overflow-hidden"
            >
              <div className="text-xs font-mono text-slate-300 space-y-2">
                <div>
                  <span className="text-slate-400">Message:</span> {error.message}
                </div>
                {error.stack && (
                  <div>
                    <span className="text-slate-400">Stack:</span>
                    <pre className="whitespace-pre-wrap text-slate-300 mt-1 text-xs">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function ErrorBoundaryProvider(props: ErrorBoundaryProviderProps) {
  return <ErrorBoundaryClass {...props} />;
}

export function useErrorBoundary() {
  const context = useContext(ErrorBoundaryContext);
  if (context === undefined) {
    throw new Error('useErrorBoundary must be used within an ErrorBoundaryProvider');
  }
  return context;
}