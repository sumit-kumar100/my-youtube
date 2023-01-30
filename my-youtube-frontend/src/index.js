import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './Routes';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './styles/globals.css';
import './styles/bootstrap.min.css';
import 'react-notifications/lib/notifications.css';
import './styles/globals.scss'


ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
