import { useEffect, useState, useRef } from 'react';
import type { LoadingStage } from '../components/Loading/ProgressiveLoader';

// Step 5: Performance monitoring for 3-second loading target
export interface PerformanceMetrics {
  initialLoadTime: number;
  primaryLoadTime: number;
  secondaryLoadTime: number;
  totalLoadTime: number;
  isWithinTarget: boolean; // 3-second target
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    initialLoadTime: 0,
    primaryLoadTime: 0,
    secondaryLoadTime: 0,
    totalLoadTime: 0,
    isWithinTarget: false
  });

  const startTimeRef = useRef<number>(Date.now());
  const stageTimesRef = useRef<Record<string, number>>({});

  const markStageComplete = (stage: LoadingStage) => {
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTimeRef.current;

    stageTimesRef.current[stage] = elapsedTime;

    setMetrics((prev) => {
      const newMetrics = { ...prev };

      switch (stage) {
        case 'primary':
          newMetrics.primaryLoadTime = elapsedTime;
          break;
        case 'secondary':
          newMetrics.secondaryLoadTime = elapsedTime;
          break;
        case 'complete':
          newMetrics.totalLoadTime = elapsedTime;
          newMetrics.isWithinTarget = elapsedTime <= 3000; // 3-second target
          break;
      }

      return newMetrics;
    });

    // Log performance for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] Stage ${stage} completed in ${elapsedTime}ms`);
      if (stage === 'complete') {
        console.log(`[Performance] Total load time: ${elapsedTime}ms (Target: 3000ms)`);
        console.log(`[Performance] Within target: ${elapsedTime <= 3000 ? '✅' : '❌'}`);
      }
    }
  };

  const resetTimer = () => {
    startTimeRef.current = Date.now();
    stageTimesRef.current = {};
    setMetrics({
      initialLoadTime: 0,
      primaryLoadTime: 0,
      secondaryLoadTime: 0,
      totalLoadTime: 0,
      isWithinTarget: false
    });
  };

  return {
    metrics,
    markStageComplete,
    resetTimer
  };
};

// Step 5: Progressive data loading hook with priority management
interface ProgressiveLoadingConfig {
  primaryQueries: string[];
  secondaryQueries: string[];
  enableCache?: boolean;
  targetTime?: number;
}

export const useProgressiveLoading = (config: ProgressiveLoadingConfig) => {
  const [stage, setStage] = useState<LoadingStage>('initial');
  const [loadedQueries, setLoadedQueries] = useState<Set<string>>(new Set());
  const { markStageComplete } = usePerformanceMonitor();

  const registerQueryLoad = (queryName: string, isLoading: boolean, data: any) => {
    if (!isLoading && data && !loadedQueries.has(queryName)) {
      setLoadedQueries((prev) => new Set([...prev, queryName]));
    }
  };

  useEffect(() => {
    const primaryComplete = config.primaryQueries.every((query) => loadedQueries.has(query));

    const secondaryComplete = config.secondaryQueries.every((query) => loadedQueries.has(query));

    if (primaryComplete && stage === 'initial') {
      setStage('primary');
      markStageComplete('primary');
    }

    if (secondaryComplete && stage === 'primary') {
      setStage('secondary');
      markStageComplete('secondary');
    }

    if (primaryComplete && secondaryComplete && stage !== 'complete') {
      setStage('complete');
      markStageComplete('complete');
    }
  }, [loadedQueries, config.primaryQueries, config.secondaryQueries, stage, markStageComplete]);

  return {
    stage,
    registerQueryLoad,
    isLoading: stage !== 'complete',
    primaryLoaded: config.primaryQueries.every((query) => loadedQueries.has(query)),
    secondaryLoaded: config.secondaryQueries.every((query) => loadedQueries.has(query))
  };
};

// Step 5: Mobile optimization hook for QR scanning performance
export const useMobileOptimization = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [connectionType, setConnectionType] = useState<string>('4g');
  const [shouldPrioritize, setShouldPrioritize] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const mobile =
        window.innerWidth <= 768 ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      setShouldPrioritize(mobile);
    };

    // Detect connection type
    const checkConnection = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          const effectiveType = connection.effectiveType || '4g';
          setConnectionType(effectiveType);

          // Prioritize for slower connections
          if (['slow-2g', '2g', '3g'].includes(effectiveType)) {
            setShouldPrioritize(true);
          }
        }
      }
    };

    checkMobile();
    checkConnection();

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const getOptimizationStrategy = () => {
    if (!isMobile) return 'standard';
    if (connectionType === 'slow-2g' || connectionType === '2g') return 'minimal';
    if (connectionType === '3g') return 'reduced';
    return 'mobile';
  };

  return {
    isMobile,
    connectionType,
    shouldPrioritize,
    optimizationStrategy: getOptimizationStrategy()
  };
};

// Step 5: Lazy loading utilities for components and images
export const useLazyComponent = <T extends Record<string, any>>(
  importFunction: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType
) => {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    importFunction()
      .then((module) => {
        if (mounted) {
          setComponent(() => module.default);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { Component, isLoading, error, Fallback: fallback };
};

// Step 5: Image preloading for critical path optimization
export const useImagePreloader = (imageSources: string[], priority = false) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageSources.map((src) => {
        return new Promise<string>((resolve, reject) => {
          const img = new Image();

          img.onload = () => {
            setLoadedImages((prev) => new Set([...prev, src]));
            resolve(src);
          };

          img.onerror = () => {
            setFailedImages((prev) => new Set([...prev, src]));
            reject(new Error(`Failed to load image: ${src}`));
          };

          // Set priority loading attributes for critical images
          if (priority) {
            img.setAttribute('loading', 'eager');
            img.setAttribute('fetchpriority', 'high');
          }

          img.src = src;
        });
      });

      try {
        await Promise.allSettled(promises);
      } catch (error) {
        console.warn('Some images failed to preload:', error);
      }
    };

    if (imageSources.length > 0) {
      preloadImages();
    }
  }, [imageSources, priority]);

  return {
    loadedImages,
    failedImages,
    allLoaded: imageSources.every((src) => loadedImages.has(src)),
    anyFailed: failedImages.size > 0
  };
};

export default usePerformanceMonitor;
