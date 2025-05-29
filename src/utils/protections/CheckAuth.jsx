import { login, logout } from 'store/features/authSlice';

import FullScreenLoader from 'components/Loader/FullScreenLoader';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useUserDataQuery } from 'store/api/authApi';

const CheckAuth = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Skip authentication check on auth pages to prevent redirect loops
  const isAuthPage = location.pathname.startsWith('/auth/');

  const { data, isLoading, isError, isSuccess } = useUserDataQuery(undefined, {
    skip: isAuthPage // Skip the query on auth pages
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(login(data));
    } else if (isError && !isAuthPage) {
      // Only dispatch logout if not on auth page
      dispatch(logout());
    }
  }, [dispatch, data, isSuccess, isError, isAuthPage]);

  // On auth pages, we skip the query, so we need to ensure loading is false
  // so that NotAuthenticated component can render properly
  useEffect(() => {
    if (isAuthPage) {
      // Set loading to false and ensure user is marked as not authenticated
      dispatch(logout());
    }
  }, [isAuthPage, dispatch]);

  return isLoading && !isAuthPage ? <FullScreenLoader /> : <Outlet />;
};

export default CheckAuth;
