import { useAtom } from 'jotai';
import { FC } from 'react';
import { Redirect } from 'react-router';
import { Route } from 'react-router-dom';
import { userAtom } from '../atoms/user';

interface Props {
  path: string;
  children: any;
}

const AuthRoute: FC<Props> = ({ path, children }) => {
  const [{ isAuthenticated }] = useAtom(userAtom);

  return (
    <Route
      exact
      path={path}
      render={(render) => {
        if (!isAuthenticated) {
          return <Redirect to='/login' />;
        }
        return children;
      }}
    />
  );
};

export default AuthRoute;
