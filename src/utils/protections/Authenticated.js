import { Navigate, Outlet, useLocation } from "react-router-dom";

import { LOGIN_PAGE_URL } from "config/routes";
import { useSelector } from "react-redux";

const Authenticated = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);

  const { pathname } = useLocation();
  const nextUrl = LOGIN_PAGE_URL + "?next=" + pathname;

  return isLoading === false && isAuthenticated ? (
    <Outlet />
  ) : isLoading === false && isAuthenticated === false ? (
    <Navigate
      to={nextUrl}
      state={{
        next: pathname,
      }}
    />
  ) : (
    <></>
  );
};

export default Authenticated;
