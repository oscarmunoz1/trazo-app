import { useState, useEffect } from 'react';
import { useGetPlansQuery, Plan } from 'store/api/subscriptionApi';

/**
 * Custom hook for fetching pricing plans with error handling
 *
 * @returns {Object} Pricing data and loading state
 */
export const usePricing = () => {
  const [activeInterval, setActiveInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [isError, setIsError] = useState<boolean>(false);

  // Use the RTK Query hook to fetch plans
  const { data: plans = [], isLoading, error, refetch } = useGetPlansQuery(activeInterval);

  // Set error state if there's an error
  useEffect(() => {
    if (error) {
      console.error('Error fetching pricing plans:', error);
      setIsError(true);
    } else {
      setIsError(false);
    }
  }, [error]);

  // Change the active interval if needed
  const changeInterval = (interval: 'monthly' | 'yearly') => {
    setActiveInterval(interval);
  };

  return {
    isPricingDataLoading: isLoading,
    pricingData: plans,
    isError,
    refetch,
    activeInterval,
    changeInterval
  };
};

export default usePricing;
