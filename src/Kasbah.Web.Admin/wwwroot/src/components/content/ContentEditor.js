import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Editor from './Editor';
import * as actionCreators from 'actions/content';
import { Button } from 'components/ui';

const mapStateToProps = (state) => ({
    content: state.content.content,
    currentVersion: state.content.currentVersion
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});


class ContentEditor extends React.Component {
    static propTypes = {
        modelDef: React.PropTypes.object.isRequired,
        version: React.PropTypes.object.isRequired,
        error: React.PropTypes.object
    }

    handleFieldChange(field, value) {
        this.props.actions.updateModel(field, value)
    }

    handleSave() {

    }

    handleReset() {

    }

    render() {
        if (!this.props.currentVersion) { return null; }

        return (
            <div>
                <Editor modelDef={this.props.modelDef} model={this.props.version.values} errors={this.props.errors || {}} onFieldChange={this.handleFieldChange.bind(this)} />
                <div>
                    <Button label='Reset' onClick={this.handleReset.bind(this)} buttonState='secondary' buttonSize='sm' disabled={true} />
                    <Button label='Save' onClick={this.handleSave.bind(this)} buttonState='success' buttonSize='sm' />
                </div>
            </div>);
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ContentEditor);
