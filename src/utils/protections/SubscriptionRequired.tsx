import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RootState } from 'store/index';

interface Company {
  id: string | number;
  subscription?: any;
  subscription_plan?: {
    id: string | number;
  };
}

const SubscriptionRequired = () => {
  const currentCompany = useSelector((state: RootState) => state.company.currentCompany) as
    | Company
    | {};
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const location = useLocation();

  // Skip subscription check if coming from Stripe billing or already on pricing page
  if (
    location.pathname.includes('/admin/dashboard/pricing') ||
    location.pathname === '/account/billing' ||
    location.pathname.includes('/stripe/success')
  ) {
    return <Outlet />;
  }

  // Only redirect if we're certain there's no subscription and we have all the data
  // This allows the component to render the Outlet while the data is loading
  if (
    isAuthenticated &&
    currentCompany &&
    Object.keys(currentCompany).length > 0 &&
    'id' in currentCompany &&
    !(
      ('subscription' in currentCompany && currentCompany.subscription) ||
      ('subscription_plan' in currentCompany && currentCompany.subscription_plan?.id)
    )
  ) {
    // Redirect to admin dashboard pricing with company ID as parameter
    return (
      <Navigate
        to={`/admin/dashboard/pricing?new_company=false&company_id=${currentCompany.id}`}
        replace
      />
    );
  }

  // Allow rendering the outlet by default, which maintains the current page
  return <Outlet />;
};

export default SubscriptionRequired;
