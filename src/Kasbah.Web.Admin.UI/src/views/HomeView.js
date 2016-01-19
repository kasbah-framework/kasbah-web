import React from 'react';
import { connect } from 'react-redux';
import { actions as siteActions } from '../redux/modules/sites';
import { Link } from 'react-router';
import SiteList from 'components/ui/SiteList';

const mapStateToProps = (state) => ({
  sites: state.sites
});

export class HomeView extends React.Component {
    static propTypes = {
      sites: React.PropTypes.object.isRequired,
      loadSites: React.PropTypes.func.isRequired,
    };

    componentWillMount() {
        this.props.loadSites();
    }

    render () {
      return (
            <div className='container page-content'>
                <div className='card'>
                    <div className='card-header'>
                        Hosted websites
                    </div>
                    {this.props.sites.sites && <SiteList sites={this.props.sites.sites} />}
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

const actions = {
  loadSites: siteActions.loadSites
};

export default connect(mapStateToProps, actions)(HomeView);
