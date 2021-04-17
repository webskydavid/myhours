import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router';
import { useActions, useAppState } from '../../providers/AppProvider/provider';
import classes from './Logout.module.css';

const Logout = () => {
  const state = useAppState();
  const { logout } = useActions();
  const history = useHistory();
  return (
    <div className={classes.root}>
      {state.isAuthenticated ? (
        <GoogleLogout
          clientId='140151512167-vkvlkuo7qvpbfgvlvm7u675so24gp6a0.apps.googleusercontent.com'
          buttonText='Logout'
          onLogoutSuccess={() => {
            console.log('Logout');
            logout();
            history.push('/login');
          }}
          onFailure={() => {
            console.log('Error');
          }}
          render={({ onClick }) => {
            return (
              <button className={classes.button} onClick={onClick}>
                Logout
              </button>
            );
          }}
        />
      ) : null}
    </div>
  );
};

export default Logout;
