import React from 'react';
import { connect } from 'react-redux';
import Editor from './Editor';
import { Button } from 'components/ui';
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
      this.props.saveContent(this.props.version);
    }

    handleReset () {

    }

    handleSetActive () {
      this.props.setActiveVersion(this.props.version.nodeId, this.props.version.id);
    }

    render () {
      return (
            <div>
                <Editor modelDef={this.props.modelDef} model={this.props.version.values} errors={this.props.errors || {}} onFieldChange={this.handleFieldChange.bind(this)} />
                <div>
                    <Button label='Reset' onClick={this.handleReset.bind(this)} buttonState='secondary' buttonSize='sm' disabled={!this.props.version.$dirty} />
                    <Button label='Save' onClick={this.handleSave.bind(this)} buttonState='success' buttonSize='sm' disabled={!this.props.version.$dirty} />
                    <Button label='Set active (publish)' onClick={this.handleSetActive.bind(this)} buttonState='info' buttonSize='sm' disabled={this.props.version.isActive || !this.props.version.id} />
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
