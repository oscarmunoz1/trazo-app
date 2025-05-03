import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { RootState } from 'store/index';

interface Company {
  id: string | number;
  subscription?: any;
  subscription_plan?: any;
  has_subscription?: boolean;
}

// Component that checks for subscription and immediately redirects if needed
const NoSubscriptionRedirect = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const currentCompany = useSelector((state: RootState) => state.company.currentCompany) as
    | Company
    | {}
    | null;
  const isLoading = useSelector((state: RootState) => state.company.isLoading);
  const redirectInitiated = useRef(false);

  useEffect(() => {
    // If we already initiated a redirect for this component instance, don't do it again
    if (redirectInitiated.current) return;

    // If we're already on a pricing page, skip redirect
    if (location.pathname.includes('/pricing')) {
      console.log('NoSubscriptionRedirect: Already on pricing page, skipping redirect');
      return;
    }

    // Check if a navigation to pricing page is already in progress (from another component)
    const navigationInitiated = localStorage.getItem('navigation_to_pricing') === 'true';
    if (navigationInitiated) {
      console.log('NoSubscriptionRedirect: Navigation to pricing already initiated, skipping');
      return;
    }

    // Check for Stripe success flow flags
    const stripeCheckoutInProgress = localStorage.getItem('stripe_checkout_in_progress') === 'true';
    const redirectFromStripe = localStorage.getItem('redirect_from_stripe') === 'true';
    const subscriptionBypassTemp = localStorage.getItem('subscription_bypass_temp') === 'true';
    const stripeCheckoutCompleted = localStorage.getItem('stripe_checkout_completed') === 'true';

    // Check for timed bypass
    const bypassUntil = localStorage.getItem('subscription_bypass_until');
    const bypassTimeValid = bypassUntil && parseInt(bypassUntil) > Date.now();

    // Check URL parameters
    const params = new URLSearchParams(location.search);
    const comingFromStripe = params.get('from_stripe') === 'true';
    const isStripeSuccessPage = location.pathname.includes('/stripe-success');

    // If any of these flags are set, bypass subscription redirect
    if (
      stripeCheckoutInProgress ||
      redirectFromStripe ||
      comingFromStripe ||
      subscriptionBypassTemp ||
      stripeCheckoutCompleted ||
      bypassTimeValid ||
      isStripeSuccessPage
    ) {
      console.log('NoSubscriptionRedirect: Bypassing redirect due to Stripe checkout flow', {
        stripeCheckoutInProgress,
        redirectFromStripe,
        comingFromStripe,
        subscriptionBypassTemp,
        stripeCheckoutCompleted,
        bypassUntil,
        bypassTimeValid,
        isStripeSuccessPage,
        url: window.location.href
      });
      return;
    }

    // If loading, wait for data
    if (isLoading) {
      console.log('NoSubscriptionRedirect: Company data still loading');
      return;
    }

    // Log current state
    console.log('NoSubscriptionRedirect check:', {
      currentCompany,
      hasSubscription:
        currentCompany && typeof currentCompany === 'object' && 'has_subscription' in currentCompany
          ? currentCompany.has_subscription
          : undefined,
      subscription:
        currentCompany && typeof currentCompany === 'object' && 'subscription' in currentCompany
          ? !!currentCompany.subscription
          : undefined
    });

    // Check if company exists but has no subscription
    if (
      currentCompany &&
      typeof currentCompany === 'object' &&
      Object.keys(currentCompany).length > 0 &&
      'id' in currentCompany &&
      (('has_subscription' in currentCompany && currentCompany.has_subscription === false) ||
        !('subscription' in currentCompany) ||
        !currentCompany.subscription)
    ) {
      console.log('NoSubscriptionRedirect: Redirecting to pricing page');

      // Mark that we've initiated a redirect to prevent double redirects
      redirectInitiated.current = true;

      // Set a flag that we're navigating to pricing page
      localStorage.setItem('navigation_to_pricing', 'true');

      // After a short delay, remove the navigation flag
      setTimeout(() => {
        localStorage.removeItem('navigation_to_pricing');
      }, 2000);

      // Store the company ID directly in localStorage
      localStorage.setItem('subscription_company_id', String(currentCompany.id));

      // Use direct browser navigation for a clean, immediate redirect
      // This avoids the React Router + fallback pattern that causes flashes
      window.location.href = `/admin/dashboard/pricing`;
    } else {
      console.log('NoSubscriptionRedirect: No redirect needed');
    }
  }, [currentCompany, isLoading, location.pathname, location.search]);

  // Simply render children - redirection happens in effect
  return <>{children}</>;
};

export default NoSubscriptionRedirect;
