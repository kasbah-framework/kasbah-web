import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';
import { DropDownButton, DropDownButtonItem, Button } from 'components/ui';
import { actions as contentActions } from '../../redux/modules/content';

class ContentEditor extends React.Component {
    static propTypes = {
      node: React.PropTypes.string.isRequired,
      modelDefinition: React.PropTypes.object.isRequired,
      model: React.PropTypes.object.isRequired,
      errors: React.PropTypes.object,
      updateModel: React.PropTypes.func,
      saveContent: React.PropTypes.func
    }

    handleFieldChange (field, value) {
      this.props.updateModel(field, value);
    }

    handleSave () {
      this.props.saveContent(this.props.node, this.props.model, false);
    }

    handleSaveAndPublish () {
      this.props.saveContent(this.props.node, this.props.model, true);
    }

    handleAddChild () {

    }

    handleViewHistory () {

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
              <Button label='Add child node' buttonSize='sm' buttonState='secondary' onClick={() => this.handleAddChild()} />
              <Button label='View history' buttonSize='sm' buttonState='info' onClick={() => this.handleViewHistory()} />
            </div>
        </div>);
    }
}

const actions = {
  updateModel: contentActions.updateModel,
  saveContent: contentActions.saveContent
};

export default connect(null, actions)(ContentEditor);
