import {
  Navigate,
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
} from "react-router-dom";
import React, { useEffect } from "react";

import { LOGIN_PAGE_URL } from "config/routes";
import { useSelector } from "react-redux";

const Authenticated = ({ history }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const companyMatch = useMatch(
    "/admin/dashboard/establishment/:establishmentId"
  ) || {
    params: {},
  };

  useEffect(() => {
    const id = Number(companyMatch.params.establishmentId);
    if (currentCompany && id !== currentCompany.establishments[0].id) {
      const establishment = currentCompany.establishments[0].id;
      navigate(`/admin/dashboard/establishment/${establishment}`);
    }
  }, [currentCompany]);

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
