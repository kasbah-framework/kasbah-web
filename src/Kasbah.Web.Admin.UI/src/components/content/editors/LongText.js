import React from 'react';

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
      return (<textarea className='form-control' onChange={this.handleChange.bind(this)} value={this.props.value} />);
    }
}
