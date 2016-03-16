import React from 'react';
import ContentTree from 'containers/content/ContentTree';
import ContentEditor from 'containers/content/ContentEditor';

export default class ContentView extends React.Component {
  static propTypes = {
    init: React.PropTypes.func.isRequired,

    location: React.PropTypes.object.isRequired
  };

  componentWillMount () {
    this.props.init(this.props.location.query.node || null);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.location.query.node !== this.props.location.query.node) {
      this.props.init(nextProps.location.query.node);
    }
  }

  render () {
    return (
      <div className='container'>
        <div className='columns'>
          <div className='column is-3'>
            <ContentTree parent={this.props.location.query.node || null} />
          </div>
          <div className='column is-9'>
            <ContentEditor />
          </div>
        </div>
      </div>);
  }
};
