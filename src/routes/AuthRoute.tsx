import React, { FC, ReactNode } from 'react';
import { Redirect, useHistory, useLocation } from 'react-router';
import { Route, Link } from 'react-router-dom';
import { useAppState } from '../providers/AppProvider/provider';

interface Props {
  path: string;
  children: any;
}

const AuthRoute: FC<Props> = ({ path, children }) => {
  const { isAuthenticated } = useAppState();
  console.log(isAuthenticated);

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
