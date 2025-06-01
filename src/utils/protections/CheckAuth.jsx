import { login, logout } from 'store/features/authSlice';

import FullScreenLoader from 'components/Loader/FullScreenLoader';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useUserDataQuery } from 'store/api/authApi';

const CheckAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Skip authentication check on auth pages and public routes to prevent redirect loops
  const isAuthPage = location.pathname.startsWith('/auth/');
  const isPublicProductRoute = location.pathname.match(/^\/production\/[^\/]+\/?$/);
  const isPricingPage = location.pathname === '/pricing';

  // Skip authentication for public routes
  const skipAuth = isAuthPage || isPublicProductRoute || isPricingPage;

  const { data, isLoading, isError, isSuccess } = useUserDataQuery(undefined, {
    skip: skipAuth // Skip the query on auth pages and public routes
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(login(data));
    } else if (isError && !skipAuth) {
      // Only dispatch logout if not on auth page or public route
      dispatch(logout());
    }
  }, [dispatch, data, isSuccess, isError, skipAuth]);

  // On auth pages and public routes, we skip the query, so we need to ensure loading is false
  // so that the appropriate components can render properly
  useEffect(() => {
    if (skipAuth) {
      // For public routes, don't automatically logout - just skip auth
      if (isAuthPage) {
        // Only logout on auth pages to reset state
        dispatch(logout());
      }
    }
  }, [skipAuth, isAuthPage, dispatch]);

  return isLoading && !skipAuth ? <FullScreenLoader /> : <Outlet />;
};

export default CheckAuth;
