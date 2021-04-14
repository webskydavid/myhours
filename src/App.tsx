import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './styles.css';
import { AppProvider } from './providers/AppProvider';
import Login from './components/Login/Login';
import List from './components/List/List';
import Logout from './components/Logout/Logout';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Logout />
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/' component={List} />
        </Switch>
      </Router>
    </AppProvider>
  );
}
