import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import { useNavigate } from 'react-router-dom';
import SubscriptionLoadingState from './SubscriptionLoadingState';
import { Company } from 'types/company';
import stripeCheckoutStorage from 'utils/storage/StripeCheckoutStorage';
import { useParams } from 'react-router-dom';
// Remove imports that don't exist
// import { useAppSelector } from '../../store/hooks';
// import { getCompanySubscriptionPlanWithLoading, hasSubscription } from '../../store/selectors';
import { Spinner, Center, Box } from '@chakra-ui/react';

/**
 * SubscriptionRequired - Protects routes that require an active subscription
 *
 * This component:
 * 1. Checks if the user has an active subscription
 * 2. Shows a loading state during checkout flow
 * 3. Redirects to pricing page if no subscription is found
 * 4. Applies bypass rules during checkout process
 *
 * It's designed to work with StripeCheckoutStorage to avoid redirect loops.
 */
const SubscriptionRequired = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { companyId } = useParams<{ companyId: string }>();
  // Remove problematic selectors
  // const { data: companySubscription, isLoading: isSubscriptionLoading } = useAppSelector(
  //   getCompanySubscriptionPlanWithLoading
  // );
  // const hasActiveSubscription = useAppSelector(hasSubscription);
  const [redirectTimerActive, setRedirectTimerActive] = useState(false);

  // Get company data from Redux
  const company = useSelector((state: RootState) => {
    // Check if auth exists in state with correct type
    const auth = state.auth as any;
    if (auth && auth.companies && auth.companies.length > 0) {
      const selectedId = auth.selectedCompany;
      return auth.companies.find((company: Company) => company.id === selectedId) || null;
    }
    return null;
  });

  // Helper function to check if company has active subscription
  const hasActiveSubscription =
    company &&
    (company.has_subscription === true ||
      (company.subscription &&
        (company.subscription.id || company.subscription.status === 'active')) ||
      (company.subscription_plan && company.subscription_plan.id));

  // Check subscription status and set loading/redirect state
  useEffect(() => {
    // Enhanced Stripe success flow detection - check immediately
    const params = new URLSearchParams(location.search);
    const hasSessionId = params.get('session_id');
    const isStripeSuccessPage = location.pathname.includes('/stripe-success');
    const preventPricingPage = localStorage.getItem('prevent_pricing_page') === 'true';
    const skipPricingRender = localStorage.getItem('skip_pricing_render') === 'true';

    // If any Stripe success indicators are present, bypass completely
    if (isStripeSuccessPage || hasSessionId || preventPricingPage || skipPricingRender) {
      console.log('SubscriptionRequired: Bypassing due to Stripe success flow', {
        isStripeSuccessPage,
        hasSessionId,
        preventPricingPage,
        skipPricingRender,
        url: window.location.href
      });
      return;
    }

    // Skip check if we're in checkout flow
    if (stripeCheckoutStorage.inCheckoutFlow()) {
      console.log('In checkout flow, bypassing subscription check');
      return;
    }

    // Skip check if no company selected
    if (!company) {
      console.log('No company selected, bypassing subscription check');
      return;
    }

    // Parse URL parameters for other Stripe indicators
    const fromStripeSuccess = params.get('success') === 'true' && params.get('session_id');
    const justCompletedCheckout = params.get('stripe_checkout_completed') === 'true';
    const comingFromStripeRedirect =
      localStorage.getItem(stripeCheckoutStorage.STORAGE_KEYS.REDIRECT_FROM_STRIPE) === 'true';
    const subscriptionLoading =
      localStorage.getItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_LOADING) === 'true';

    // If we're coming from Stripe success, show loading state
    if (
      fromStripeSuccess ||
      justCompletedCheckout ||
      comingFromStripeRedirect ||
      subscriptionLoading
    ) {
      setIsLoading(true);

      // Store bypass flags to avoid redirects
      localStorage.setItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP, 'true');
      localStorage.setItem(
        stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK,
        Date.now().toString()
      );

      // Calculate how long to show loading based on redirect time
      const redirectTime = parseInt(
        localStorage.getItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_REDIRECT_TIME) || '0',
        10
      );
      const timeElapsed = Date.now() - redirectTime;
      const loadingDuration = timeElapsed < 3000 ? 3000 - timeElapsed : 3000;

      // Give time for subscription data to propagate
      const checkTimer = setTimeout(() => {
        setIsLoading(false);
        // Clean up the flags
        localStorage.removeItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_LOADING);
        localStorage.removeItem(stripeCheckoutStorage.STORAGE_KEYS.REDIRECT_FROM_STRIPE);
        localStorage.removeItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_REDIRECT_TIME);
      }, loadingDuration);

      return () => clearTimeout(checkTimer);
    }

    // Check for bypass flags
    const comingFromStripe =
      localStorage.getItem(stripeCheckoutStorage.STORAGE_KEYS.ERROR_RECOVERY) === 'true';
    const bypassDuration = 60 * 1000; // 60 seconds
    const lastCheckTime = parseInt(
      localStorage.getItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK) || '0',
      10
    );
    const temporaryBypass =
      localStorage.getItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP) ===
        'true' && Date.now() - lastCheckTime < bypassDuration;

    // Set redirect state if the user doesn't have a subscription and no bypass is active
    if (!(hasActiveSubscription || comingFromStripe || temporaryBypass)) {
      console.log('No subscription found, will redirect to pricing page');
      // Set flag to prevent redirect loops
      localStorage.setItem(stripeCheckoutStorage.STORAGE_KEYS.NAVIGATION_TO_PRICING, 'true');
      setShouldRedirect(true);

      // Schedule navigation with a small delay to avoid state update issues
      setTimeout(() => {
        navigate('/admin/dashboard/pricing', { replace: true });

        // Clear navigation flag after a delay to prevent issues with back button
        setTimeout(() => {
          localStorage.removeItem(stripeCheckoutStorage.STORAGE_KEYS.NAVIGATION_TO_PRICING);
        }, 1000);
      }, 100);
    } else {
      setShouldRedirect(false);
      // Clear the bypass flag after successful access with subscription
      if (hasActiveSubscription && temporaryBypass) {
        localStorage.removeItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_BYPASS_TEMP);
        localStorage.removeItem(stripeCheckoutStorage.STORAGE_KEYS.SUBSCRIPTION_LAST_CHECK);
      }
    }
  }, [company, location.pathname, navigate, hasActiveSubscription]);

  useEffect(() => {
    // Log current state for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[SubscriptionRequired] State: ', {
        companyId,
        hasSubscription: hasActiveSubscription,
        inCheckoutFlow: stripeCheckoutStorage.inCheckoutFlow(),
        isStripeSuccessRedirect: stripeCheckoutStorage.isStripeSuccessRedirect(),
        storedCompanyId: localStorage.getItem('subscription_company_id')
      });
    }
  }, [companyId, hasActiveSubscription]);

  useEffect(() => {
    // Clear navigation flag after a delay if it exists
    const navigationFlag = localStorage.getItem(
      stripeCheckoutStorage.STORAGE_KEYS.NAVIGATION_TO_PRICING
    );
    if (navigationFlag) {
      setTimeout(() => {
        localStorage.removeItem(stripeCheckoutStorage.STORAGE_KEYS.NAVIGATION_TO_PRICING);
      }, 2000);
    }
  }, []);

  // Handle redirect if needed
  useEffect(() => {
    if (
      !hasActiveSubscription &&
      !stripeCheckoutStorage.inCheckoutFlow() &&
      !redirectTimerActive &&
      companyId
    ) {
      // Set a small delay to allow other components to initialize
      setRedirectTimerActive(true);

      // Store the company ID for use on pricing page
      localStorage.setItem('subscription_company_id', companyId);

      // Set flag to prevent duplicate redirects
      localStorage.setItem(stripeCheckoutStorage.STORAGE_KEYS.NAVIGATION_TO_PRICING, 'true');

      const timer = setTimeout(() => {
        window.location.href = '/admin/dashboard/pricing';
      }, 500);

      return () => {
        clearTimeout(timer);
        setRedirectTimerActive(false);
      };
    }
  }, [hasActiveSubscription, companyId, redirectTimerActive]);

  // Show loading state if we're coming from checkout
  if (isLoading) {
    return <SubscriptionLoadingState />;
  }

  // Allow access if in checkout flow
  if (stripeCheckoutStorage.inCheckoutFlow()) {
    console.log('In checkout flow, bypassing subscription check');
    return <Outlet />;
  }

  // Allow access if no company selected
  if (!company) {
    console.log('No company selected, bypassing subscription check');
    return <Outlet />;
  }

  // Render children (protected route) if not redirecting
  if (!shouldRedirect) {
    return <Outlet />;
  }

  // Render loading during redirect
  return <SubscriptionLoadingState />;
};

export default SubscriptionRequired;
