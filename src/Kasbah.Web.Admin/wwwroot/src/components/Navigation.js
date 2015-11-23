import React from 'react';

export default class extends React.Component {
    render () {
        return (
            <nav className='navbar navbar-dark navbar-static-top'>
                <a className='navbar-brand' href='#'>KASBAH WEB</a>
                <ul className='nav navbar-nav'>
                    <li className='nav-item active'>
                        <a className='nav-link' href='/'>Dashboard <span className='sr-only'>(current)</span></a>
                    </li>
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
            </nav>
        );
    }
}
