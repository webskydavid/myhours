import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider/provider';
import List from './components/List/List';
import Logout from './components/Logout/Logout';
import { EventListProvider } from './providers/EventListProvider/provider';
import Login from './components/Login/Login';
import SelectCalendar from './components/SelectCalendar/SelectCalendar';
import AuthRoute from './routes/AuthRoute';
import dark from './dark-theme.module.css';
import light from './light-theme.module.css';
import './styles.module.css';

import { useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState(true);
  return (
    <div className={theme ? dark.theme : light.theme}>
      <button onClick={() => setTheme((s) => !s)}>Theme</button>
      <AppProvider>
        <EventListProvider>
          <Router>
            <Logout />
            <Switch>
              <Route path='/login' component={Login} />
              <AuthRoute path='/select'>
                <SelectCalendar />
              </AuthRoute>

              <AuthRoute path='/'>
                <List />
              </AuthRoute>
            </Switch>
          </Router>
        </EventListProvider>
      </AppProvider>
    </div>
  );
}
