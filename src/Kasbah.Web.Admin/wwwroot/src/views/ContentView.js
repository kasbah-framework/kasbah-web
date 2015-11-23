import React from 'react';

export default class HomeView extends React.Component {
    render () {
        return (
            <div className='container page-content'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-lg-3'>
                            <div className='card'>
                                <div className='card-block'>
                                    <form>
                                        <input className='form-control form-control-sm' placeholder='Live search...' />
                                    </form>
                                </div>
                                <ul className='node-list list-group list-group-flush'>
                                    <li>
                                        <div>
                                            <button>
                                                <i className='fa fa-files-o' />
                                                www.kasbah.io
                                            </button>
                                            <button className='toggle'><i className='fa fa-plus-square-o' /></button>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <button>
                                                <i className='fa fa-files-o' />
                                                www.mymonthlytee.com
                                            </button>
                                            <button className='toggle'><i className='fa fa-plus-square-o' /></button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className='col-lg-9'>
                            <p>This is really the crux of the whole system. Everything else is <small>superfluous</small>.</p>
                            <ul>
                                <li>How do you present a really nice method of editing content to the user?</li>
                                <li>How do you manage publishing content?</li>
                                <li>How do you handle multiple versions of content?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
