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
  return isLoading === false && isAuthenticated === false ? (
    <Outlet />
  ) : (
    <Navigate to={nextPath || routes.HOME_URL} />
  );
};

export default NotAuthenticated;
