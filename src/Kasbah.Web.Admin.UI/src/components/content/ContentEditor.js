import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';
import { actions as contentActions } from '../../redux/modules/content';
import { actions as treeActions } from '../../redux/modules/tree';

class ContentEditor extends React.Component {
    static propTypes = {
      node: React.PropTypes.string.isRequired,
      modelDefinition: React.PropTypes.object.isRequired,
      model: React.PropTypes.object.isRequired,
      errors: React.PropTypes.object,
      updateModel: React.PropTypes.func.isRequired,
      saveContent: React.PropTypes.func.isRequired,
      deleteNode: React.PropTypes.func.isRequired,
      unpublish: React.PropTypes.func.isRequired
    };

    handleFieldChange (field, value) {
      this.props.updateModel(field, value);
    }

    handleSave () {
      this.props.saveContent(this.props.node, this.props.model, false);
    }

    handleSaveAndPublish () {
      this.props.saveContent(this.props.node, this.props.model, true);
    }

    handleUnpublish () {
      if (confirm('Are you sure?')) {
        this.props.unpublish(this.props.node);
      }
    }

    handleViewHistory () {

    }

    handleDelete () {
      if (confirm('Are you sure?')) {
        this.props.deleteNode(this.props.node);
      }
    }

    render () {
      return (
        <div>
          <Editor node={this.props.node} modelDefinition={this.props.modelDefinition} model={this.props.model} errors={this.props.errors || {}} onFieldChange={this.handleFieldChange.bind(this)} />

          <hr />

          <button className='button is-primary' onClick={() => this.handleSave()}>Save</button>
          <button className='button is-primary' onClick={() => this.handleSaveAndPublish()}>Save and publish</button>
          <button className='button is-warning' onClick={() => this.handleUnpublish()}>Unpublish</button>
          <button className='button is-danger' onClick={() => this.handleDelete()}>Delete</button>
          <button className='button' onClick={() => this.handleViewHistory()}>View history</button>
        </div>);
    }
}

const actions = {
  updateModel: contentActions.updateModel,
  saveContent: contentActions.saveContent,
  deleteNode: treeActions.deleteNode,
  unpublish: contentActions.unpublish
};

export default connect(null, actions)(ContentEditor);
