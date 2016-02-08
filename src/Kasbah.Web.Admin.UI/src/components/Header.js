import React from 'react';
import { Link } from 'react-router';
import { clearAuthToken } from 'utils';

export default class extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  handleLogout () {
    clearAuthToken();

    this.context.router.push('/login');
  }

  render () {
    return (
      <header className='header'>
        <div className='container'>
          <div className='header-left'>
            <Link className='header-item' to='/content'>Content</Link>
            <Link className='header-item' to='/media'>Media</Link>
          </div>

          <div className='header-center'>
            <Link className='header-item' to='/'><strong>KASBAH</strong></Link>
          </div>

          <div className='header-right'>
            <div className='header-item'>
              <button className='button' onClick={this.handleLogout.bind(this)}>Logout</button>
            </div>
          </div>
        </div>
      </header>);
  }
}
