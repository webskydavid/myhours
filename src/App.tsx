import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider/provider';
import List from './components/List/List';
import Logout from './components/Logout/Logout';
import EventListProvider from './providers/EventListProvider/provider';
import Login from './components/Login/Login';
import SelectCalendar from './components/SelectCalendar/SelectCalendar';

export default function App() {
  return (
    <AppProvider>
      <EventListProvider>
        <Router>
          <Logout />
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/' component={List} />
            <Route path='/select' component={SelectCalendar} />
          </Switch>
        </Router>
      </EventListProvider>
    </AppProvider>
  );
}
