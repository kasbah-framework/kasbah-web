import React from 'react';
import { Link } from 'react-router';

export default class extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  handleLogout () {
    sessionStorage.removeItem('isAuthenticated');

    this.context.router.push('/');
  }

  render () {
    return (
      <nav className='navbar navbar-dark navbar-static-top header'>
        <div className='container'>
          <Link className='navbar-brand' to='/'><img src='/logo.png' height='30' style={{margin:0}} /></Link>
          <ul className='nav navbar-nav'>
            <li className='nav-item'>
              <Link className='nav-link' to='/content'>Content</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/media'>Media</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/analytics'>Analytics</Link>
            </li>
            <li className='nav-item'>
              <Link className='nav-link' to='/users'>Users</Link>
            </li>
          </ul>

          <ul className='nav navbar-nav pull-right'>
            <li className='nav-item'>
              <button className='btn-link nav-link' onClick={this.handleLogout.bind(this)}>Logout</button>
            </li>
          </ul>
        </div>
      </nav> );
  }
}
