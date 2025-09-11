'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface SecurityContextType {
  csrfToken: string | null;
  sessionId: string | null;
  securityLevel: 'low' | 'medium' | 'high';
  isSecureConnection: boolean;
  rateLimitStatus: {
    remaining: number;
    reset: number;
    limit: number;
  };
  generateCSRFToken: () => string;
  validateCSRFToken: (token: string) => boolean;
  reportSecurityIncident: (incident: SecurityIncident) => void;
  encryptData: (data: string) => string;
  decryptData: (encryptedData: string) => string;
}

interface SecurityIncident {
  type: 'csrf_attack' | 'rate_limit_exceeded' | 'unauthorized_access' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  userAgent?: string;
  ip?: string;
  timestamp: Date;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [securityLevel, setSecurityLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSecureConnection, setIsSecureConnection] = useState(false);
  const [rateLimitStatus, setRateLimitStatus] = useState({
    remaining: 100,
    reset: Date.now() + 3600000, // 1 hour
    limit: 100,
  });

  const router = useRouter();
  const pathname = usePathname();

  // Initialize security measures
  useEffect(() => {
    initializeSecurity();
    checkSecureConnection();
    setupSecurityHeaders();
    monitorSecurityEvents();
  }, []);

  // Route-based security monitoring
  useEffect(() => {
    validateRouteAccess(pathname);
    logRouteAccess(pathname);
  }, [pathname]);

  const initializeSecurity = () => {
    // Generate initial CSRF token
    const token = generateCSRFToken();
    setCsrfToken(token);
    
    // Set session ID
    const session = generateSessionId();
    setSessionId(session);
    
    // Store in secure storage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf_token', token);
      sessionStorage.setItem('session_id', session);
    }
  };

  const checkSecureConnection = () => {
    if (typeof window !== 'undefined') {
      setIsSecureConnection(window.location.protocol === 'https:');
    }
  };

  const setupSecurityHeaders = () => {
    // Security headers should be set via middleware/server, not client-side
    // This function is kept for future server-side header validation if needed
    if (typeof window === 'undefined') return;
    
    // Only log security monitoring info, don't set headers via DOM
    console.log('Security provider initialized with client-side monitoring');
  };

  const monitorSecurityEvents = () => {
    if (typeof window === 'undefined') return;

    // Monitor for potential XSS attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-approved')) {
                reportSecurityIncident({
                  type: 'suspicious_activity',
                  severity: 'high',
                  details: 'Unapproved script element detected',
                  timestamp: new Date(),
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Monitor for suspicious form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const csrfTokenField = formData.get('csrf_token') as string;
      
      if (!validateCSRFToken(csrfTokenField)) {
        event.preventDefault();
        reportSecurityIncident({
          type: 'csrf_attack',
          severity: 'critical',
          details: 'Invalid CSRF token detected',
          timestamp: new Date(),
        });
      }
    });

    // Monitor for rate limiting
    let requestCount = 0;
    const resetTime = Date.now() + 3600000; // 1 hour
    
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      requestCount++;
      
      if (requestCount > rateLimitStatus.limit) {
        reportSecurityIncident({
          type: 'rate_limit_exceeded',
          severity: 'medium',
          details: `Rate limit exceeded: ${requestCount} requests`,
          timestamp: new Date(),
        });
        
        return Promise.reject(new Error('Rate limit exceeded'));
      }
      
      setRateLimitStatus({
        remaining: rateLimitStatus.limit - requestCount,
        reset: resetTime,
        limit: rateLimitStatus.limit,
      });
      
      return originalFetch.apply(this, args);
    };
  };

  const validateRouteAccess = (route: string) => {
    const sensitiveRoutes = ['/admin', '/api', '/dashboard'];
    const isSensitiveRoute = sensitiveRoutes.some(sensitive => route.startsWith(sensitive));
    
    if (isSensitiveRoute) {
      setSecurityLevel('high');
    } else if (route.startsWith('/profile') || route.startsWith('/settings')) {
      setSecurityLevel('medium');
    } else {
      setSecurityLevel('low');
    }
  };

  const logRouteAccess = (route: string) => {
    const accessLog = {
      route,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : '',
      sessionId,
    };
    
    // In production, send to logging service
    console.log('Route access:', accessLog);
  };

  const generateCSRFToken = (): string => {
    const array = new Uint8Array(32);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
    } else {
      // Fallback for server-side or unsupported browsers
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const validateCSRFToken = (token: string): boolean => {
    if (!token || !csrfToken) return false;
    return token === csrfToken;
  };

  const reportSecurityIncident = (incident: SecurityIncident) => {
    console.warn('Security incident:', incident);
    
    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service
      fetch('/api/security/incidents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify(incident),
      }).catch(error => {
        console.error('Failed to report security incident:', error);
      });
    }
  };

  const encryptData = (data: string): string => {
    // Simple encryption for client-side data (not for sensitive data)
    // In production, use proper encryption libraries
    return btoa(encodeURIComponent(data));
  };

  const decryptData = (encryptedData: string): string => {
    try {
      return decodeURIComponent(atob(encryptedData));
    } catch {
      throw new Error('Failed to decrypt data');
    }
  };

  const value: SecurityContextType = {
    csrfToken,
    sessionId,
    securityLevel,
    isSecureConnection,
    rateLimitStatus,
    generateCSRFToken,
    validateCSRFToken,
    reportSecurityIncident,
    encryptData,
    decryptData,
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}