import React from 'react';
import { Link } from 'react-router';

export default class SiteList extends React.Component {
    static propTypes = {
      sites: React.PropTypes.array.isRequired
    };

    render () {
      return (
        <table className='table is-striped'>
          <thead>
            <tr>
              <th>Sites hosted</th>
              <th>Public domain</th>
            </tr>
          </thead>
          <tbody>
          {this.props.sites.map(site =>
            <tr key={site.id}>
              <td>
                <Link key={site.id} to={{ pathname: '/content', query: { node: site.id } }}>
                  {site.displayName}
                </Link>
              </td>
              <td>
              {site.domains.map((dom, index) =>
                <a key={index}
                  href={`http://${dom}`}
                  className='button is-small'
                  target='_blank'>{dom}</a>
              )}
              </td>
            </tr>)}
          </tbody>
        </table>);
    }
}
