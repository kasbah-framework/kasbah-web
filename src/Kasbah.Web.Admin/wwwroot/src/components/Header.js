import React from 'react';

export default class extends React.Component {
    render () {
        return (
            <nav className='navbar navbar-dark navbar-static-top header'>
                <a className='navbar-brand' href='/'>DASHBOARD</a>
                <ul className='nav navbar-nav'>
                    <li className='nav-item'>
                        <a className='nav-link' href='/content'>Content</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link' href='/media'>Media</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link' href='/analytics'>Analytics</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link' href='/users'>Users</a>
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
