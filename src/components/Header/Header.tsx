import { FC } from 'react';
import Logout from '../Logout/Logout';
import classes from './Header.module.css';

const Header: FC = () => {
  return (
    <div className={classes.root}>
      <div>
        <button>Calendars</button>
      </div>
      <div>
        <button>Theme</button>
      </div>
      <div>
        <Logout />
      </div>
    </div>
  );
};

export default Header;
