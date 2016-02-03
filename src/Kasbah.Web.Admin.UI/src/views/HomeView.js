import React from 'react';
import { connect } from 'react-redux';
import { actions as siteActions } from '../redux/modules/sites';
import SiteList from 'components/ui/SiteList';

const mapStateToProps = (state) => ({
  sites: state.sites
});

export class HomeView extends React.Component {
  static propTypes = {
    sites: React.PropTypes.object.isRequired,
    loadSites: React.PropTypes.func.isRequired
  };

  componentWillMount () {
    this.props.loadSites();
  }

  render () {
    return (
      <div className='container'>
        <div className='columns'>
          <div className='column'>
            {this.props.sites.sites && <SiteList sites={this.props.sites.sites} />}
          </div>
        </div>
      </div>
    );
  }
}

const actions = {
  loadSites: siteActions.loadSites
};

export default connect(mapStateToProps, actions)(HomeView);
