import React from 'react';
import Editor from './Editor';

export default class ContentEditor extends React.Component {
  static propTypes = {
    node: React.PropTypes.object,
    model: React.PropTypes.object.isRequired,
    values: React.PropTypes.object.isRequired,

    updateField: React.PropTypes.func.isRequired,
    save: React.PropTypes.func.isRequired
  };

  render () {
    if (!this.props.node) return null;

    return (
      <div className=''>
        <Editor node={this.props.node} model={this.props.model} values={this.props.values} onFieldChange={(field, value) => this.props.updateField(field.alias, value)} />

        <hr />

        <div>
          <button className='button is-primary' onClick={() => this.props.save(false)}>Save</button>
          <button className='button is-primary' onClick={() => this.props.save(true)}>Save and publish</button>
          <button className='button is-warning' onClick={() => this.handleUnpublish()}>Unpublish</button>
          <button className='button is-danger' onClick={() => this.handleDelete()}>Delete</button>
        </div>

      </div>);
  }
};
