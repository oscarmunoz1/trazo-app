import * as routes from "../../config/routes";

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useSelector } from "react-redux";

const NotAuthenticated = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const location = useLocation();

  return isLoading === false && isAuthenticated === false ? (
    <Outlet />
  ) : (
    <Navigate to={routes.HOME_URL} />
  );
};

export default NotAuthenticated;
