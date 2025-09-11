'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';

interface PerformanceContextType {
  isLoading: boolean;
  networkStatus: 'online' | 'offline';
  cacheStats: {
    hits: number;
    misses: number;
    size: number;
  };
  preloadRoute: (route: string) => Promise<void>;
  clearCache: () => void;
  optimizeImages: boolean;
  setOptimizeImages: (optimize: boolean) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 403) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

export function PerformanceProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <PerformanceProviderInner>{children}</PerformanceProviderInner>
    </QueryClientProvider>
  );
}

function PerformanceProviderInner({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [cacheStats, setCacheStats] = useState({ hits: 0, misses: 0, size: 0 });
  const [optimizeImages, setOptimizeImages] = useState(true);
  const queryClient = useQueryClient();

  // Network status monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  // Cache statistics monitoring
  useEffect(() => {
    const updateCacheStats = () => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();
      
      setCacheStats({
        hits: queries.filter(q => q.state.data !== undefined).length,
        misses: queries.filter(q => q.state.error !== undefined).length,
        size: queries.length,
      });
    };

    const interval = setInterval(updateCacheStats, 30000); // Update every 30 seconds
    updateCacheStats(); // Initial update

    return () => clearInterval(interval);
  }, [queryClient]);

  // Route preloading
  const preloadRoute = async (route: string) => {
    try {
      setIsLoading(true);
      
      // Preload the route using Next.js app router prefetching
      if (typeof window !== 'undefined') {
        try {
          // Use app router prefetch if available
          const { useRouter } = await import('next/navigation');
          // Note: This is for client-side prefetching, actual implementation
          // would need to be handled at the component level
        } catch {
          // Fallback for pages router
          try {
            const { default: Router } = await import('next/router');
            await Router.prefetch(route);
          } catch (routerError) {
            console.warn('Router prefetch not available:', routerError);
          }
        }
      }

      // Preload critical resources for the route
      await preloadCriticalResources(route);
    } catch (error) {
      console.warn('Route preloading failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cache management
  const clearCache = () => {
    queryClient.clear();
    
    // Clear browser caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
    
    setCacheStats({ hits: 0, misses: 0, size: 0 });
  };

  // Performance monitoring and optimization
  useEffect(() => {
    // Web Vitals monitoring - simplified for compatibility
    if (typeof window !== 'undefined') {
      import('web-vitals').then((webVitals) => {
        // Use dynamic access to avoid TypeScript issues
        const vitals = webVitals as any;
        if (vitals.onCLS) vitals.onCLS((metric: any) => console.log('CLS:', metric));
        if (vitals.onFID) vitals.onFID((metric: any) => console.log('FID:', metric));
        if (vitals.onFCP) vitals.onFCP((metric: any) => console.log('FCP:', metric));
        if (vitals.onLCP) vitals.onLCP((metric: any) => console.log('LCP:', metric));
        if (vitals.onTTFB) vitals.onTTFB((metric: any) => console.log('TTFB:', metric));
      }).catch(() => {
        console.warn('Web vitals monitoring not available');
      });
    }

    // Resource hints for critical resources
    addResourceHints();

    // Service worker registration for caching
    registerServiceWorker();
  }, []);

  const value: PerformanceContextType = {
    isLoading,
    networkStatus,
    cacheStats,
    preloadRoute,
    clearCache,
    optimizeImages,
    setOptimizeImages,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

// Helper functions
async function preloadCriticalResources(route: string) {
  const criticalResources = getCriticalResourcesForRoute(route);
  
  await Promise.allSettled(
    criticalResources.map(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.url;
      link.as = resource.type;
      if (resource.type === 'font') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
      
      return new Promise((resolve, reject) => {
        link.onload = resolve;
        link.onerror = reject;
      });
    })
  );
}

function getCriticalResourcesForRoute(route: string) {
  const commonResources = [
    { url: '/fonts/inter.woff2', type: 'font' },
  ];

  const routeSpecificResources: Record<string, Array<{ url: string; type: string }>> = {
    '/dashboard': [
      { url: '/api/user/dashboard', type: 'fetch' },
    ],
    '/profile': [
      { url: '/api/user/profile', type: 'fetch' },
    ],
    '/jobs': [
      { url: '/api/jobs', type: 'fetch' },
    ],
  };

  return [...commonResources, ...(routeSpecificResources[route] || [])];
}

function addResourceHints() {
  // DNS prefetch for external domains
  const externalDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ];

  externalDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });

  // Preconnect to critical origins
  const criticalOrigins = [
    'https://api.fixly.com',
  ];

  criticalOrigins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    document.head.appendChild(link);
  });
}

async function registerServiceWorker() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (error) {
      console.warn('Service worker registration failed:', error);
    }
  }
}

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
}