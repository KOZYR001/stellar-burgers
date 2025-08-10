import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { Preloader } from '@ui';
import { getUserState } from '@slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({ onlyUnAuth }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthChecked, isAuthenticated } = useSelector(getUserState);

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from =
      (location.state as { from?: { pathname: string } })?.from?.pathname ||
      '/profile';
    return <Navigate replace to={from} />;
  }

  if (isAuthChecked) {
    return <Preloader />;
  }

  return <Outlet />;
};
