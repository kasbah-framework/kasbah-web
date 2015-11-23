import React from 'react';

export default class HomeView extends React.Component {
    render () {
        return (
            <div className='container page-content'>
                <div className='card'>
                    <div className='card-header'>
                        <strong>Hosted websites</strong>
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
                                <strong>Latest content</strong>
                            </div>
                            <div className='card-block'>
                                <p className='card-text'>... maybe ...</p>
                            </div>
                            <div className='card-footer text-right'>
                                <a className='card-link' href='/content'>Content navigator</a>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-4'>
                        <div className='card'>
                            <div className='card-header'>
                                <strong>Trending content</strong>
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
                                <strong>System health</strong>
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
                        <strong>Analytics</strong>
                    </div>
                    <div className='card-block'>
                        <p className='card-text'>... maybe ...</p>
                    </div>
                </div>
            </div>
        );
    }
}
