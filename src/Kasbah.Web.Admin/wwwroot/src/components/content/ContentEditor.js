import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Editor from './Editor';
import * as actionCreators from 'actions/content';

const mapStateToProps = (state) => ({
    content: state.content.content,
    currentVersion: state.content.currentVersion
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});


class ContentEditor extends React.Component {
    static propTypes = {
        nodeId: React.PropTypes.string.isRequired
    }

    handleFieldChange(field, value) {
        this.props.actions.updateModel(field, value)
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.nodeId || nextProps.nodeId !== this.props.nodeId) {
            this.load(nextProps.nodeId);
        }
    }

    componentWillMount() {
        if (this.props.nodeId) {
            this.load(this.props.nodeId);
        }
    }

    load(id) {
        this.props.actions.loadContent(id);
    }

    handleSelectVersion(version) {
        this.props.actions.selectVersion(version);
    }

    _renderVersionSelector() {
        if (!this.props.content) { return null; }

        return (<ul>
            {this.props.content.versions.map(ent => <li key={ent.id}><button onClick={this.handleSelectVersion.bind(this, ent)}>{ent.id}</button></li>)}
            </ul>);
    }

    _renderEditor() {
        if (!this.props.currentVersion) { return null; }

        return (<Editor modelDef={this.props.content.modelDefinition} model={this.props.currentVersion.values} errors={this.props.content.errors || {}} onFieldChange={this.handleFieldChange.bind(this)} />);
    }

    render() {
        return (
            <div>
                {this._renderVersionSelector()}
                {this._renderEditor()}
            </div>);
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ContentEditor);
