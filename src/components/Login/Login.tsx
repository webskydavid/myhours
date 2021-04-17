import React, { FC } from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router';
import { useActions, useAppState } from '../../providers/AppProvider/provider';
import classes from './Login.module.css';

const Login: FC = () => {
  const state = useAppState();
  const { login, loginFailure } = useActions();
  const history = useHistory();
  return (
    <div className={classes.root}>
      {!state.isAuthenticated ? (
        <GoogleLogin
          isSignedIn
          clientId='140151512167-vkvlkuo7qvpbfgvlvm7u675so24gp6a0.apps.googleusercontent.com'
          buttonText='Login'
          onSuccess={(u: any): void => {
            if (u) {
              login(u.tokenObj);
              history.push('/');
            }
          }}
          onFailure={(e) => {
            loginFailure();
          }}
          render={({ onClick }) => {
            return (
              <button className={classes.button} onClick={onClick}>
                Login with Google Account
              </button>
            );
          }}
          cookiePolicy={'single_host_origin'}
          scope='https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
        />
      ) : (
        'Logout'
      )}
    </div>
  );
};

export default Login;
