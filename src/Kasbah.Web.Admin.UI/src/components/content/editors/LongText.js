import React from 'react';
// import AceEditor from 'react-ace';

export default class extends React.Component {
    static alias = 'longtext';
    static propTypes = {
      field: React.PropTypes.object.isRequired,
      value: React.PropTypes.any,
      onChange: React.PropTypes.func.isRequired
    };

    handleChange (ev) {
      this.props.onChange(this.props.field, ev.target.value);
    }

    render () {
      // return <AceEditor onChange={this.handleChange.bind(this)} value={this.props.value} />;
      return (<textarea className='textarea' onChange={this.handleChange.bind(this)} value={this.props.value} />);
    }
}
