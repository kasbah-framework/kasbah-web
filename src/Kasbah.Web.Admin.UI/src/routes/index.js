import React from 'react';
import { Route, IndexRoute } from 'react-router';
import CoreLayout from 'layouts/CoreLayout';

import { getAuthToken } from 'utils';

import HomeView from 'views/HomeView';
import ContentView from 'views/ContentView';
import AnalyticsView from 'views/AnalyticsView';
import UserView from 'views/UserView';
import MediaView from 'views/MediaView';
import LoginView from 'views/LoginView';

function checkAuth (nextState, replace) {
  if (!getAuthToken()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}

export default (store) => (
  <Route path='/'>
    <Route component={CoreLayout}>
      <IndexRoute component={HomeView} onEnter={checkAuth} />
      <Route path='/content' component={ContentView} onEnter={checkAuth} />
      <Route path='/analytics' component={AnalyticsView} onEnter={checkAuth} />
      <Route path='/users' component={UserView} onEnter={checkAuth} />
      <Route path='/media' component={MediaView} onEnter={checkAuth} />
    </Route>

    <Route path='/login' component={LoginView} />
  </Route>
);
