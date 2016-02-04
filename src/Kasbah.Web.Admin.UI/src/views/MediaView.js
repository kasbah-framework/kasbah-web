import React from 'react';

export default class extends React.Component {
  constructor () {
    super();

    this.state = {};
  }

  render () {
    return (
        <div className='container'>
          <table className='table is-striped'>
            <thead>
              <tr>
                <th />
                <th>File name</th>
                <th style={{ width: 200 }}>Modified</th>
                <th style={{ width: 120 }}>Type</th>
                <th style={{ width: 120 }}>Size</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='table-icon'><i className='fa fa-folder' /></td>
                <td className='table-link'><a href=''>some folder</a></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className='table-icon'><i className='fa fa-image' /></td>
                <td className='table-link'><a href=''>some image</a></td>
                <td>February 4, 2016 4:22pm</td>
                <td>image/jpeg</td>
                <td>74.2 kb</td>
              </tr>
            </tbody>
          </table>
        </div>
    );
  }
}
