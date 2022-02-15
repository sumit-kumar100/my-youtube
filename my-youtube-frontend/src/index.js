import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/globals.css';
import './styles/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import './styles/globals.scss'
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/store';


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
