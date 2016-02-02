import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter } from 'redux-simple-router';
import Root from './containers/Root';
import configureStore from './redux/configureStore';
import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from './utils';

const history = createBrowserHistory();
const store = configureStore(window.__INITIAL_STATE__);

syncReduxAndRouter(history, store, (state) => state.router);

const rootComponent = <Root history={history} store={store} />;

window.Root = rootComponent;

fetch(`${API_URL}/api/modules`)
  .then(checkHttpStatus)
  .then(parseJSON)
  .then(response => {
    for (var module of response) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = module;
      document.body.appendChild(script);
    }
  });

// Render the React application to the DOM
ReactDOM.render(
  rootComponent,
  document.getElementById('root')
);
