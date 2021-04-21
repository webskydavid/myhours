import { useAtom } from 'jotai';
import { GoogleLogout } from 'react-google-login';
import { useHistory } from 'react-router';
import { signOutAtom, userAtom } from '../../atoms/user';
import classes from './Logout.module.css';

const Logout = () => {
  const [state] = useAtom(userAtom);
  const [, signOut] = useAtom(signOutAtom);

  const history = useHistory();
  return state.isAuthenticated ? (
    <GoogleLogout
      clientId='140151512167-vkvlkuo7qvpbfgvlvm7u675so24gp6a0.apps.googleusercontent.com'
      buttonText='Logout'
      onLogoutSuccess={() => {
        signOut();
        history.push('/login');
      }}
      onFailure={() => {
        console.log('Error');
      }}
      render={({ onClick }) => {
        return <button onClick={onClick}>Logout</button>;
      }}
    />
  ) : null;
};

export default Logout;
