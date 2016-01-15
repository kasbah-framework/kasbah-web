import React from 'react';
import { Link } from 'react-router';

export default class extends React.Component {
    render () {
      return (
            <nav className='navbar navbar-dark navbar-static-top header'>
                <Link className='navbar-brand' to='/'>DASHBOARD</Link>
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
                        <button className='btn-link nav-link'>Logout</button>
                    </li>
                </ul>
            </nav>
        );
    }
}
