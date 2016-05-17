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
      <header className='container'>
        <nav className='navbar'>
          <div className='navbar-left'>
            <div className='navbar-item'><Link to='/content'>Content</Link></div>
            <div className='navbar-item'><Link to='/media'>Media</Link></div>
          </div>

          <div className='navbar-center'>
            <div className='navbar-item'>
              <Link to='/'><strong>KASBAH</strong></Link>
            </div>
          </div>

          <div className='navbar-right'>
            <div className='navbar-item'>
              <button className='button' onClick={() => this.handleLogout()}>Logout</button>
            </div>
          </div>
        </nav>
      </header>);
  }
}
