import React, { FC } from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router';
import { useApp } from '../../providers/AppProvider';
import classes from './Login.module.css';

const Login: FC = () => {
  const { state, actions } = useApp();
  const history = useHistory();
  return (
    <div className={classes.root}>
      {!state.isLoggedIn ? (
        <GoogleLogin
          isSignedIn
          clientId='140151512167-vkvlkuo7qvpbfgvlvm7u675so24gp6a0.apps.googleusercontent.com'
          buttonText='Login'
          onSuccess={(u: any): void => {
            if (u) {
              console.log(u);
              actions.login(u.tokenObj);
              history.push('/');
            }
          }}
          onFailure={(e) => {
            console.log(e);
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
