import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import makeRoutes from './routes';
import Root from './containers/Root';
import configureStore from './redux/configureStore';
import { getAuthToken } from 'utils';

const historyConfig = { basename: __BASENAME__ };
const history = useRouterHistory(createHistory)(historyConfig);

(function () {
  window.__INITIAL_STATE__ = window.__INITIAL_STATE__ || {};
  const authToken = getAuthToken();
  if (authToken) {
    window.__INITIAL_STATE__.auth = { token: authToken, isAuthenticated: true };
  }
})();

const initialState = window.__INITIAL_STATE__;
const store = configureStore({ initialState, history });

const routes = makeRoutes(store);

// Render the React application to the DOM
ReactDOM.render(
  <Root history={history} routes={routes} store={store} />,
  document.getElementById('root')
);
