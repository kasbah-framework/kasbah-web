import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';
import { DropDownButton, DropDownButtonItem, Button } from 'components/ui';
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
      types: React.PropTypes.object.isRequired,
      onAddChild: React.PropTypes.func.isRequired,
      deleteNode: React.PropTypes.func.isRequired
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

    handleViewHistory () {

    }

    handleDelete() {
      if (confirm('Are you sure?')) {
        this.props.deleteNode(this.props.node);
      }
    }

    render () {
      return (
        <div>
            <Editor modelDefinition={this.props.modelDefinition} model={this.props.model} errors={this.props.errors || {}} onFieldChange={this.handleFieldChange.bind(this)} />
            <div className='form-group'>
              <DropDownButton buttonSize='sm' label='Save' buttonState='success'>
                <DropDownButtonItem onClick={() => this.handleSave()}>Save only</DropDownButtonItem>
                <DropDownButtonItem onClick={() => this.handleSaveAndPublish()}>Save and publish</DropDownButtonItem>
              </DropDownButton>
              <DropDownButton buttonSize='sm' label='Add child node' buttonState='secondary'>
                {this.props.types.types.map((type, index) => <DropDownButtonItem key={index} onClick={this.props.onAddChild.bind(this, this.props.node, type)}>{type.displayName}</DropDownButtonItem>)}
              </DropDownButton>
              <Button label='Delete' buttonSize='sm' buttonState='danger' onClick={() => this.handleDelete()} />
              <Button label='View history' buttonSize='sm' buttonState='info' onClick={() => this.handleViewHistory()} />
            </div>
        </div>);
    }
}

const actions = {
  updateModel: contentActions.updateModel,
  saveContent: contentActions.saveContent,
  deleteNode: treeActions.deleteNode
};

export default connect(null, actions)(ContentEditor);
