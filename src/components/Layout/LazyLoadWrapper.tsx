import React, { Suspense, lazy } from 'react';
import { ProgressiveLoader, LoadingStage } from 'components/Loading/ProgressiveLoader';
import { usePerformanceMonitor, useMobileOptimization } from 'hooks/usePerformanceMonitor';

// Step 5: Universal Lazy Loading Wrapper for Progressive Enhancement
interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallbackType?: 'dashboard' | 'carbon' | 'form' | 'table' | 'profile' | 'mobile-list';
  performanceTracking?: boolean;
  stage?: LoadingStage;
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallbackType = 'dashboard',
  performanceTracking = true,
  stage = 'initial'
}) => {
  const { isMobile } = useMobileOptimization();
  const { resetTimer } = usePerformanceMonitor();

  // Auto-detect mobile fallback type
  const adaptiveFallbackType =
    isMobile && fallbackType === 'dashboard' ? 'mobile-list' : fallbackType;

  React.useEffect(() => {
    if (performanceTracking) {
      resetTimer();
    }
  }, [performanceTracking, resetTimer]);

  return (
    <Suspense fallback={<ProgressiveLoader stage={stage} type={adaptiveFallbackType} />}>
      {children}
    </Suspense>
  );
};

// Step 5: HOC for Progressive Loading Enhancement
export const withProgressiveLoading = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallbackType?: 'dashboard' | 'carbon' | 'form' | 'table' | 'profile' | 'mobile-list';
    performanceTracking?: boolean;
  }
) => {
  const WrappedComponent = (props: P) => (
    <LazyLoadWrapper
      fallbackType={options?.fallbackType}
      performanceTracking={options?.performanceTracking}
    >
      <Component {...props} />
    </LazyLoadWrapper>
  );

  WrappedComponent.displayName = `withProgressiveLoading(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

// Step 5: Lazy component factory with automatic performance tracking
export const createLazyComponent = <P extends Record<string, any>>(
  importFunction: () => Promise<{ default: React.ComponentType<P> }>,
  fallbackType?: 'dashboard' | 'carbon' | 'form' | 'table' | 'profile' | 'mobile-list'
) => {
  const LazyComponent = lazy(importFunction);

  return (props: P) => (
    <LazyLoadWrapper fallbackType={fallbackType}>
      <LazyComponent {...(props as P)} />
    </LazyLoadWrapper>
  );
};

export default LazyLoadWrapper;
