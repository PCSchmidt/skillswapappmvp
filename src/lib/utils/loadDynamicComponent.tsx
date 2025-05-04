/**
 * Dynamic Component Loader
 * 
 * This utility provides a standardized way to dynamically import 
 * components for code splitting. It includes error handling and 
 * loading states.
 */

import React, { Suspense, ComponentType, lazy } from 'react';
import { useResponsive } from '@/contexts/ResponsiveContext';

// Loading component that adjusts to device size
const DynamicLoading: React.FC<{ size?: 'small' | 'medium' | 'large' }> = ({ size = 'medium' }) => {
  const { isMobile } = useResponsive();
  
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-3'
  };
  
  const actualSize = isMobile && size === 'large' ? 'medium' : size;
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className={`animate-spin rounded-full ${sizeClasses[actualSize]} border-t-indigo-600 border-b-indigo-600 border-l-gray-200 border-r-gray-200`}></div>
    </div>
  );
};

// Error boundary for dynamic components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-700 bg-red-100 rounded-md m-2">
          <h3 className="font-bold">Something went wrong</h3>
          <p>The component failed to load. Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default options
const defaultOptions = {
  loading: <DynamicLoading />,
  errorComponent: undefined,
  suspense: true,
  delay: 200 // Small delay to prevent flickering for fast loads
};

interface LoadComponentOptions {
  loading?: React.ReactNode;
  errorComponent?: React.ReactNode;
  suspense?: boolean;
  delay?: number;
}

/**
 * Load a component dynamically with code splitting
 * 
 * @param importFunc Dynamic import function for the component
 * @param options Configuration options
 * @returns A lazy-loaded component
 */
export function loadDynamicComponent<P>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: LoadComponentOptions = {}
): React.ComponentType<P> {
  const {
    loading,
    errorComponent,
    suspense,
    delay
  } = { ...defaultOptions, ...options };

  // Create the lazy component with a small delay to prevent flickering
  const LazyComponent = lazy(() => {
    return new Promise(resolve => {
      // Add a small delay to prevent flickering for fast loads
      if (delay > 0) {
        setTimeout(() => {
          resolve(importFunc());
        }, delay);
      } else {
        resolve(importFunc());
      }
    });
  });

  // Return the wrapped component
  return (props: P) => {
    return (
      <ErrorBoundary fallback={errorComponent}>
        {suspense ? (
          <Suspense fallback={loading}>
            <LazyComponent {...props} />
          </Suspense>
        ) : (
          <LazyComponent {...props} />
        )}
      </ErrorBoundary>
    );
  };
}

/**
 * Utility to create a page component that adapts to the device
 * @param defaultImport Default component import
 * @param mobileImport Optional mobile-specific component import
 */
export function createResponsiveComponent<P>(
  defaultImport: () => Promise<{ default: ComponentType<P> }>,
  mobileImport?: () => Promise<{ default: ComponentType<P> }>
): React.ComponentType<P> {
  const DefaultComponent = loadDynamicComponent<P>(defaultImport);
  
  // If no mobile variant, just return the default component
  if (!mobileImport) {
    return DefaultComponent;
  }
  
  const MobileComponent = loadDynamicComponent<P>(mobileImport);
  
  // Return component that selects based on device
  return (props: P) => {
    const { isMobile } = useResponsive();
    
    return isMobile ? <MobileComponent {...props} /> : <DefaultComponent {...props} />;
  };
}

export default loadDynamicComponent;
