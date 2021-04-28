import { render } from 'react-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import App from './App';

const rootElement = document.getElementById('root');
render(<App />, rootElement);

serviceWorkerRegistration.register();

reportWebVitals();
