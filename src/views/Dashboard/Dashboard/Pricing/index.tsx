import PricingContent from '../../../../views/Pages/Pricing/index';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/index';
import { useLocation } from 'react-router-dom';

/**
 * DashboardPricing component
 * Displays pricing plans within the dashboard layout, directly passing the company ID
 * to avoid multiple redirects and URL parameter changes
 */
function DashboardPricing() {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const activeCompany = useSelector((state: RootState) => state.company.currentCompany);
  const location = useLocation();

  // Get company ID on component mount
  useEffect(() => {
    // Clear navigation flag since we've arrived at the pricing page
    localStorage.removeItem('navigation_to_pricing');

    // First check if company ID is in URL parameters
    const params = new URLSearchParams(location.search);
    const urlCompanyId = params.get('company_id');

    if (urlCompanyId) {
      console.log('Using company ID from URL parameters:', urlCompanyId);
      setCompanyId(urlCompanyId);

      // Remove only company_id from URL, preserve other parameters like new_company
      if (window.history.replaceState) {
        params.delete('company_id'); // Only remove company_id
        const newSearch = params.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
        window.history.replaceState({ path: newUrl }, '', newUrl);
      }

      // Also store in localStorage for consistency
      localStorage.setItem('subscription_company_id', urlCompanyId);
      return;
    }

    // Next try to get company ID from localStorage (set by NoSubscriptionRedirect or Dashboard)
    const storedCompanyId = localStorage.getItem('subscription_company_id');
    if (storedCompanyId) {
      console.log('Using company ID from localStorage:', storedCompanyId);
      setCompanyId(storedCompanyId);
      // Don't remove from localStorage here, keep it for potential redirects
    }
    // If not in localStorage, try to get from Redux state
    else if (activeCompany && typeof activeCompany === 'object' && 'id' in activeCompany) {
      console.log('Using company ID from Redux state:', activeCompany.id);
      setCompanyId(String(activeCompany.id));
      // Store in localStorage for consistency
      localStorage.setItem('subscription_company_id', String(activeCompany.id));
    }

    // Cleanup function to run when component unmounts
    return () => {
      // When navigating away from pricing, clear the company ID from localStorage
      // to prevent stale data on future visits, but not the one in progress
      const shouldKeep = localStorage.getItem('navigation_to_pricing') === 'true';
      if (!shouldKeep) {
        localStorage.removeItem('subscription_company_id');
      }
    };
  }, [activeCompany, location.search]);

  // Pass companyId directly as prop instead of using URL parameters
  return <PricingContent inDashboard={true} companyId={companyId} />;
}

export default DashboardPricing;
