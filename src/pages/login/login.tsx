import { FC, SyntheticEvent, useState, useEffect } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import { getError, getUserState, loginUser } from '@slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const error = useSelector(getError);
  const { isAuthenticated, loginUserRequest } = useSelector(getUserState);

  useEffect(() => {
    if (isAuthenticated && !loginUserRequest) {
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/profile';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loginUserRequest, navigate, location]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error?.toString()}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
