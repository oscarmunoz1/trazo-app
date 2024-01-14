import { login, logout } from 'store/features/authSlice';

import FullScreenLoader from 'components/Loader/FullScreenLoader';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useUserDataQuery } from 'store/api/authApi';

const CheckAuth = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isSuccess } = useUserDataQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(login(data));
    } else if (isError) {
      dispatch(logout());
    }
  }, [dispatch, data, isSuccess, isError]);

  return isLoading ? <FullScreenLoader /> : <Outlet />;
};

export default CheckAuth;
