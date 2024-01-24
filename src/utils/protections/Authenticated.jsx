import { Navigate, Outlet, useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';
import { PRODUCER, SUPERUSER } from '../../config';
import React, { useEffect } from 'react';

import { LOGIN_PAGE_URL } from 'config/routes';
import { useSelector } from 'react-redux';

const Authenticated = ({ allowedRoles, mustBeCompanyAdmin = false }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isLoading = useSelector((state) => state.auth.isLoading);
  const currentCompany = useSelector((state) => state.company.currentCompany);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.userState.user);

  const { establishmentId } = useParams();

  useEffect(() => {
    if (currentUser?.user_type === PRODUCER || currentUser?.user_type === SUPERUSER) {
      const id = Number(establishmentId);

      if (
        (establishmentId || pathname == '/admin/dashboard' || pathname == '/admin/dashboard/') &&
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
    }
  }, [currentCompany, establishmentId, navigate, currentUser]);

  useEffect(() => {
    if (currentUser?.user_type === PRODUCER || currentUser?.user_type === SUPERUSER) {
      if (currentUser?.companies.length === 0) {
        navigate(`/admin/dashboard/select-company`);
      } else if (
        currentUser?.companies.length === 1 &&
        currentCompany?.establishments &&
        currentCompany.establishments.length === 0
      ) {
        navigate(`/admin/dashboard/establishment/add`);
      }
    }
  }, [currentCompany, currentUser, navigate]);

  const nextUrl = LOGIN_PAGE_URL + (pathname !== '/' ? '?next=' + pathname : '');

  return isLoading === false &&
    isAuthenticated &&
    allowedRoles.includes(currentUser?.user_type) &&
    (mustBeCompanyAdmin
      ? currentUser?.companies[0].role === 'Company Admin' || currentUser?.user_type === SUPERUSER
      : true) ? (
    <Outlet />
  ) : isLoading === false && isAuthenticated === false ? (
    <Navigate to={nextUrl} state={{ next: pathname }} />
  ) : mustBeCompanyAdmin && currentUser?.companies[0].role !== 'Company Admin' ? (
    <Navigate to="/admin/dashboard" />
  ) : // ) : isLoading === false &&
  //   isAuthenticated &&
  //   currentUser &&
  //   !allowedRoles.includes(currentUser.user_type) ? (
  //   <Navigate to="/pricing" />
  null;
};

export default Authenticated;
