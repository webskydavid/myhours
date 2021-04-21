import { FC } from 'react';
import classes from './Header.module.css';
import { GoogleLogout } from 'react-google-login';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { AiFillCalendar } from 'react-icons/ai';
import { HiTemplate, HiTerminal } from 'react-icons/hi';
import { useAtom } from 'jotai';
import { signOutAtom, userAtom } from '../../atoms/user';
import { useHistory } from 'react-router-dom';

const Header: FC = () => {
  const [state] = useAtom(userAtom);
  const [, signOut] = useAtom(signOutAtom);
  const history = useHistory();

  return (
    <div className={classes.root}>
      <div
        className={classes.action}
        onClick={() => {
          history.push('/');
        }}
      >
        <HiTerminal />
        <span>Hours</span>
      </div>
      <div
        className={classes.action}
        onClick={() => {
          history.push('/select');
        }}
      >
        <AiFillCalendar />
        <span>Calendars</span>
      </div>
      <div
        className={classes.action}
        onClick={() => {
          history.push('/settings');
        }}
      >
        <HiTemplate />
        <span>Settings</span>
      </div>
      {state.isAuthenticated ? (
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
            return (
              <div className={classes.action} onClick={onClick}>
                <RiLogoutBoxRFill />
                <span>Logout</span>
              </div>
            );
          }}
        />
      ) : null}
    </div>
  );
};

export default Header;
