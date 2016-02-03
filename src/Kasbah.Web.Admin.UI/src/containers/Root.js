import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import CoreLayout from 'layouts/CoreLayout';
import { getAuthToken } from 'utils';

import HomeView from 'views/HomeView';
import ContentView from 'views/ContentView';
import AnalyticsView from 'views/AnalyticsView';
import UserView from 'views/UserView';
import MediaView from 'views/MediaView';
import LoginView from 'views/LoginView';


export default class Root extends React.Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  };

  checkAuth(nextState, replace) {
    if (!getAuthToken()) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  }

  get content () {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={CoreLayout}>
          <IndexRoute component={HomeView} onEnter={this.checkAuth.bind(this)} />
          <Route path='/content' component={ContentView} onEnter={this.checkAuth.bind(this)} />
          <Route path='/analytics' component={AnalyticsView} onEnter={this.checkAuth.bind(this)} />
          <Route path='/users' component={UserView} onEnter={this.checkAuth.bind(this)} />
          <Route path='/media' component={MediaView} onEnter={this.checkAuth.bind(this)} />

        </Route>
        <Route path='/login' component={LoginView} />
      </Router>
    );
  }

  get devTools () {
    if (__DEBUG__) {
      if (__DEBUG_NEW_WINDOW__) {
        require('../redux/utils/createDevToolsWindow')(this.props.store);
      } else {
        const DevTools = require('containers/DevTools');
        return <DevTools />;
      }
    }
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {this.content}
          {this.devTools}
        </div>
      </Provider>
    );
  }
}
