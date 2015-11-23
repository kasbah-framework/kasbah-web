import React                    from 'react';
import { Provider }             from 'react-redux';
import routes                   from '../routes';
import { ReduxRouter }          from 'redux-router';
import DevTools                 from './DevTools';
import { createDevToolsWindow } from '../utils';
import LoginView                from 'views/LoginView';

export default class Root extends React.Component {
  static propTypes = {
    store : React.PropTypes.object.isRequired,
    debug : React.PropTypes.bool,
    debugExternal : React.PropTypes.bool
  }

  static defaultProps = {
    debug : false,
    debugExternal : false
  }

  renderDevTools () {
    if (!this.props.debug) {
      return null;
    }

    return this.props.debugExternal ?
      createDevToolsWindow(this.props.store) : <DevTools />;
  }

  render () {
    // const content = localStorage.token ? (<ReduxRouter>{routes}</ReduxRouter>) : (<LoginView />);
    const content = <ReduxRouter>{routes}</ReduxRouter>;

    return (
      <div>
        <Provider store={this.props.store}>
          <div>
            {content}
            {this.renderDevTools()}
          </div>
        </Provider>
      </div>
    );
  }
}
