import React from 'react';
import { Link } from 'react-router';

export default class SiteList extends React.Component {
    static propTypes = {
      sites: React.PropTypes.array.isRequired,
    };

    render () {
      return (
        <ul className='list-group list-group-flush'>
        {this.props.sites.map(site =>
          <li className='list-group-item' key={site.id}>
            {site.domains.map((dom, index) =>
              <a key={index}
                href={`http://${dom}`}
                className='pull-right label label-pill label-default'
                target="_blank">{dom}</a>
            )}

            <h6 className="list-group-item-heading">
              <Link key={site.id} to={{ pathname: '/content', query: { site: site.id } }}>
                {site.displayName}
              </Link>
            </h6>
          </li>)}
        </ul> );
    }
}
