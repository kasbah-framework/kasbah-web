import React from 'react';
import ContentTree from 'containers/content/ContentTree';
import ContentEditor from 'containers/content/ContentEditor';

export default class extends React.Component {
  static propTypes = {
    init: React.PropTypes.func.isRequired,

    location: React.PropTypes.object.isRequired
  };

  componentWillMount () {
    this.props.init(this.props.location.query.node || null);
  }

  render () {
    return (
      <div className='container'>
        <div className='columns'>
          <div className='column is-3'>
            <ContentTree />
          </div>
          <div className='column is-9'>
            <ContentEditor />
          </div>
        </div>
      </div>);
  }
};
