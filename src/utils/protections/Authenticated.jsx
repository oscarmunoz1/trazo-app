import {
  Navigate,
  Outlet,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import React, { useEffect } from "react";

import { LOGIN_PAGE_URL } from "config/routes";
import { useSelector } from "react-redux";

const Authenticated = ({ allowedRoles }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.userState.user);

  const { establishmentId } = useParams();

  useEffect(() => {
    const id = Number(establishmentId);

    if (
      (establishmentId ||
        pathname == "/admin/dashboard" ||
        pathname == "/admin/dashboard/") &&
      currentUser?.companies.length > 0
    ) {
      if (
        currentCompany &&
        currentCompany.establishments &&
        !currentCompany.establishments.map((e) => e.id).includes(id)
      ) {
        if (currentCompany.establishments?.length > 0) {
          const establishment = currentCompany.establishments[0].id;
          navigate(`/admin/dashboard/establishment/${establishment}`);
        } else {
          navigate(`/admin/dashboard/`);
        }
      }
    }
  }, [currentCompany, establishmentId, navigate, currentUser]);

  useEffect(() => {
    if (currentUser?.companies.length === 0) {
      navigate(`/admin/dashboard/select-company`);
    }
  }, [currentUser, navigate]);

  const nextUrl =
    LOGIN_PAGE_URL + (pathname !== "/" ? "?next=" + pathname : "");

  return isLoading === false &&
    isAuthenticated &&
    allowedRoles.includes(currentUser?.user_type) ? (
    <Outlet />
  ) : isLoading === false && isAuthenticated === false ? (
    <Navigate to={nextUrl} state={{ next: pathname }} />
  ) : // ) : isLoading === false &&
  //   isAuthenticated &&
  //   currentUser &&
  //   !allowedRoles.includes(currentUser.user_type) ? (
  //   <Navigate to="/pricing" />
  null;
};

export default Authenticated;
