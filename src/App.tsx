import { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AuthRoute from './routes/AuthRoute';
import dark from './dark-theme.module.css';
import light from './light-theme.module.css';
import './styles.module.css';

import { Provider } from 'jotai';
import Header from './components/Header/Header';

const Login = lazy(() => import('./components/Login/Login'));
const Settings = lazy(() => import('./components/Settings/Settings'));
const EventForm = lazy(() => import('./components/EventForm/EventForm'));
const SelectCalendar = lazy(
  () => import('./components/SelectCalendar/SelectCalendar')
);
const List = lazy(() => import('./components/List/List'));

export default function App() {
  const [theme] = useState(true);
  return (
    <div className={theme ? dark.theme : light.theme}>
      <Provider>
        <Suspense fallback='...'>
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
        </Suspense>
      </Provider>
    </div>
  );
}
