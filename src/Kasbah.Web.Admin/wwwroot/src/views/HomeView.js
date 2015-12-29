import React from 'react';
import { Link } from 'react-router'

export default class HomeView extends React.Component {
    render () {
      return (
            <div className='container page-content'>
                <div className='card'>
                    <div className='card-header'>
                        Hosted websites
                    </div>
                    <ul className='list-group list-group-flush'>
                        <li className='list-group-item'>
                            Site
                        </li>
                    </ul>
                </div>

                <div className='row'>
                    <div className='col-lg-4'>
                        <div className='card'>
                            <div className='card-header'>
                                Latest content
                            </div>
                            <div className='card-block'>
                                <p className='card-text'>... maybe ...</p>
                            </div>
                            <div className='card-footer text-right'>
                                <Link className='card-link' to='/content'>Content navigator</Link>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-4'>
                        <div className='card'>
                            <div className='card-header'>
                                Trending content
                            </div>
                            <div className='card-block'>
                                <p className='card-text'>... maybe ...</p>
                            </div>
                            <div className='card-footer text-right'>
                                <a className='card-link' href='/analytics'>Analytics</a>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-4'>
                        <div className='card'>
                            <div className='card-header'>
                                System health
                            </div>
                            <div className='card-block'>
                                <p className='card-text'>... maybe ...</p>
                            </div>
                            <div className='card-footer text-right'>
                                <a className='card-link' href='/health'>System statistics</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='card'>
                    <div className='card-header'>
                        Analytics
                    </div>
                    <div className='card-block'>
                        <p className='card-text'>... maybe ... graphs and tables go here ...</p>
                    </div>
                </div>
            </div>
        );
    }
}
