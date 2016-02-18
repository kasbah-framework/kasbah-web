import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import DevTools from 'containers/DevToolsWindow';
import MimeTypes from 'constants/MimeTypes';

export function createConstants (...constants) {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant;
    return acc;
  }, {});
}

export function createReducer (initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer ? reducer(state, action.payload) : state;
  };
}

export function createDevToolsWindow (store) {
  const win = window.open(
    null,
    'redux-devtools', // give it a name so it reuses the same window
    `width=400,height=${window.outerHeight},menubar=no,location=no,resizable=yes,scrollbars=no,status=no`
);

    // reload in case it's reusing the same window with the old content
  win.location.reload();

    // wait a little bit for it to reload, then render
  setTimeout(() => {
        // Wait for the reload to prevent:
        // "Uncaught Error: Invariant Violation: _registerComponent(...): Target container is not a DOM element."
    win.document.write('<div id="react-devtools-root"></div>');
    win.document.body.style.margin = '0';

    ReactDOM.render(
        <Provider store={store}>
            <DevTools />
        </Provider>, win.document.getElementById('react-devtools-root')
    );
  }, 10);
}

export function checkHttpStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}

export function parseJSON (response) {
  return response.json();
}

export function getAuthToken () {
  // This should be reading from the state
  if (localStorage.token) {
    return localStorage.token;
  } else if (sessionStorage.token) {
    return sessionStorage.token;
  }

  return null;
}

export function clearAuthToken () {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
}

export function fetchWrapper (url, method, body) {
  let headers = {
    'Accept': MimeTypes.application.json
  };

  const authToken = getAuthToken();
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  let config = {
    method: method || 'GET',
    credentials: 'include',
    headers
  };

  if (body) {
    config.headers['Content-Type'] = MimeTypes.application.json;
    config.body = JSON.stringify(body);
  }

  return fetch(url, config)
  .then(checkHttpStatus)
  .then(parseJSON);
}
