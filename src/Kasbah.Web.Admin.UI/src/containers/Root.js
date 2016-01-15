// const content = (this.props.store.auth && this.props.store.auth.isAuthenticated) ? (<ReduxRouter>{routes}</ReduxRouter>) : (<LoginView />);
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import LoginView from 'views/LoginView';

export default class Root extends React.Component {
  static propTypes = {
    history: React.PropTypes.object.isRequired,
    routes: React.PropTypes.element.isRequired,
    store: React.PropTypes.object.isRequired
  };

  get content () {
    // return <LoginView />
    return (
      <Router>
        {this.props.routes}
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
