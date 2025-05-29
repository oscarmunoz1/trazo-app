import * as routes from '../../config/routes';

import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useSelector } from 'react-redux';

const NotAuthenticated = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const location = useLocation();

  // Get the 'next' parameter from URL
  const params = new URLSearchParams(location.search);
  const nextPath = params.get('next');

  // Check if we're on an auth page
  const isAuthPage = location.pathname.startsWith('/auth/');

  // If we're on an auth page, always show the auth pages regardless of loading state
  // This prevents issues when auth check is skipped
  if (isAuthPage) {
    return isAuthenticated ? <Navigate to={nextPath || routes.HOME_URL} replace /> : <Outlet />;
  }

  // For non-auth pages, wait for loading to complete
  if (isLoading) {
    return null;
  }

  // If user is NOT authenticated, show the auth pages (Outlet)
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // If user IS authenticated, redirect to the intended destination
  return <Navigate to={nextPath || routes.HOME_URL} replace />;
};

export default NotAuthenticated;
