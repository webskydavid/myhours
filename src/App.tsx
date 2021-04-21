import { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import List from './components/List/List';
import Login from './components/Login/Login';
import SelectCalendar from './components/SelectCalendar/SelectCalendar';
import AuthRoute from './routes/AuthRoute';
import dark from './dark-theme.module.css';
import light from './light-theme.module.css';
import './styles.module.css';

import { Provider } from 'jotai';
import Header from './components/Header/Header';
import Settings from './components/Settings/Settings';
import EventForm from './components/EventForm/EventForm';

export default function App() {
  const [theme] = useState(true);
  return (
    <div className={theme ? dark.theme : light.theme}>
      <Provider>
        <Router>
          <Header />
          <Switch>
            <Route path='/login' component={Login} />
            <AuthRoute path='/settings'>
              <Settings />
            </AuthRoute>
            <AuthRoute path='/select'>
              <SelectCalendar />
            </AuthRoute>

            <AuthRoute path='/'>
              <List />
            </AuthRoute>
          </Switch>
          <EventForm />
        </Router>
      </Provider>
    </div>
  );
}
