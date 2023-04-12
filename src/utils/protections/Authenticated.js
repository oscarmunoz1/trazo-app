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
import { useGetCompanyQuery } from "store/features/companyApi";
import { useSelector } from "react-redux";

const Authenticated = ({ history }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.userState.user);

  const { establishmentId, parcelId } = useParams();
  // const { data, status } = useGetCompanyQuery(currentUser?.companies[0].id);

  useEffect(() => {
    const id = Number(establishmentId);
    // if (data && status === "fulfilled") {

    if (currentUser?.companies.length > 0) {
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

    // }
  }, [currentCompany, establishmentId, navigate, currentUser]);

  useEffect(() => {
    if (currentUser?.companies.length === 0) {
      navigate(`/admin/dashboard/select-company`);
    }
  }, [currentUser, navigate]);

  // useEffect(() => {
  //   const id = Number(establishmentId);
  //   // if (data && status === "fulfilled") {
  //   if (
  //     currentCompany &&
  //     !currentCompany.establishments.map((e) => e.id).includes(id)
  //   ) {
  //     if (currentCompany.establishments.length > 0) {
  //       const establishment = currentCompany.establishments[0].id;
  //       navigate(`/admin/dashboard/establishment/${establishment}`);
  //     } else {
  //       navigate(`/admin/dashboard/`);
  //     }
  //   } else if (!currentCompany) {
  //     navigate(`/admin/dashboard/select-company`);
  //   }
  //   // }
  // }, [currentCompany, establishmentId, navigate]);

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
