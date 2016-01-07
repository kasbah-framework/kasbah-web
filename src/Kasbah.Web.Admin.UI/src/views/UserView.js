import React from 'react';

export default class extends React.Component {
    render () {
      return (
            <div className='container page-content'>
                <div className='card'>
                    <div className='card-header'>
                        System Users
                    </div>
                    <div className='card-block'>
                        <p className='card-text'>table of filterable users goes here.</p>
                    </div>
                </div>
            </div>
        );
    }
}
