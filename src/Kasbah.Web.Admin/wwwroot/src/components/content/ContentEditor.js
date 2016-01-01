import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';
import { DropDownButton, DropDownButtonItem, Button } from 'components/ui';
import { actions as contentActions } from '../../redux/modules/content';

class ContentEditor extends React.Component {
    static propTypes = {
      modelDef: React.PropTypes.object.isRequired,
      version: React.PropTypes.object.isRequired,
      errors: React.PropTypes.object,
      updateModel: React.PropTypes.func,
      saveContent: React.PropTypes.func,
      setActiveVersion: React.PropTypes.func
    }

    handleFieldChange (field, value) {
      this.props.updateModel(field, value);
    }

    handleSave () {
      this.props.saveContent(this.props.version, false);
    }

    handleSaveAndPublish () {
      this.props.saveContent(this.props.version, true);
    }

    render () {
      return (
        <div>
            <Editor modelDef={this.props.modelDef} model={this.props.version.values} errors={this.props.errors || {}} onFieldChange={this.handleFieldChange.bind(this)} />
            <div className='form-group'>
              <DropDownButton buttonSize='sm' label='Save' buttonState='success'>
                <DropDownButtonItem onClick={() => this.handleSave()}>Save only</DropDownButtonItem>
                <DropDownButtonItem onClick={() => this.handleSaveAndPublish()}>Save and publish</DropDownButtonItem>
              </DropDownButton>
              <Button label='Add child node' buttonSize='sm' buttonState='secondary' />
              <Button label='View history' buttonSize='sm' buttonState='info' />
            </div>
        </div>);
    }
}

const actions = {
  updateModel: contentActions.updateModel,
  saveContent: contentActions.saveContent,
  setActiveVersion: contentActions.setActiveVersion
};

export default connect(null, actions)(ContentEditor);
