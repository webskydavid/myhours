import { useAtom } from 'jotai';
import { FC } from 'react';
import GoogleLogin from 'react-google-login';
import { useHistory } from 'react-router';
import { signInAtom, signInFailureAtom, userAtom } from '../../atoms/user';
import classes from './Login.module.css';

const Login: FC = () => {
  const [state] = useAtom(userAtom);
  const [, signIn] = useAtom(signInAtom);
  const [, signInFailure] = useAtom(signInFailureAtom);

  const history = useHistory();
  return (
    <div className={classes.root}>
      <h4>My Hours</h4>
      {!state.isAuthenticated ? (
        <GoogleLogin
          isSignedIn
          clientId='140151512167-vkvlkuo7qvpbfgvlvm7u675so24gp6a0.apps.googleusercontent.com'
          buttonText='Login'
          onSuccess={(u: any): void => {
            if (u) {
              signIn(u.tokenObj);
              history.push('/');
            }
          }}
          onFailure={(e) => {
            signInFailure();
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
