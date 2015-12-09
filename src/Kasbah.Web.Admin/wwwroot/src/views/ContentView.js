import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as treeActionCreators from 'actions/tree';
import * as contentActionCreators from 'actions/content';
import NodeList from 'components/tree/NodeList';
import ContentEditor from 'components/content/ContentEditor';
import { Button, DropDownButton, DropDownButtonItem, DropDownButtonSeparator, States } from 'components/ui';


const mapStateToProps = (state) => ({
    tree: state.tree,
    content: state.content.content,
    currentVersion: state.content.currentVersion
});
const mapDispatchToProps = (dispatch) => ({
    treeActions: bindActionCreators(treeActionCreators, dispatch),
    contentActions: bindActionCreators(contentActionCreators, dispatch)
});

export class ContentView extends React.Component {
    constructor() {
        super();

        this.state = { selectedNode: null };
    }

    handleNodeSelected(node) {
        this.setState({ selectedNode: node });
        this.props.contentActions.loadContent(node.id);
    }

    handleToggleNode(node) {
        this.props.treeActions.toggleNode(node);
        if (node.expanded) {
            this.props.treeActions.clearChildren(node);
        }
        else {
            this.props.treeActions.fetchChildren(node.id);
        }
    }

    componentWillMount() {
        // TODO: limit the node tree to start at the /sites/ node
        this.props.treeActions.fetchChildren(null);
    }

    handleSelectVersion(version) {
        this.props.contentActions.selectVersion(version);
    }

    handleNewVersion() {
        this.props.contentActions.addVersion(this.state.selectedNode.id);
    }

    _renderVersionSelector() {
        if (!this.props.content) { return null; }
        return (
            <div className='form-group'>
                <DropDownButton label='Versions' buttonState='default'>
                    {this.props.content.versions.map((ent, index) => <DropDownButtonItem key={index} onClick={this.handleSelectVersion.bind(this, ent)}>{ent.id ? ent.id : <em>Unsaved version</em>} {ent.isActive && <span className="label label-success">active</span>}</DropDownButtonItem>)}
                    {this.props.content.versions.length > 0 && <DropDownButtonSeparator />}
                    <DropDownButtonItem onClick={this.handleNewVersion.bind(this)}>New version</DropDownButtonItem>
                </DropDownButton>
            </div> );
    }

    render () {
        return (
            <div className='container page-content'>
                <div className='container-fluid'>
                    <div className='row'>
                        <div className='col-lg-3'>
                            <div className='card'>
                                <div className='card-block'>
                                    <form>
                                        <input className='form-control form-control-sm' placeholder='Live search...' disabled />
                                    </form>
                                </div>
                                <NodeList
                                    parent={null}
                                    nodeTree={this.props.tree}
                                    onNodeSelected={this.handleNodeSelected.bind(this)}
                                    onToggleNode={this.handleToggleNode.bind(this)}
                                    className='node-list list-group list-group-flush' />
                            </div>
                        </div>

                        <div className='col-lg-9'>
                            {this._renderVersionSelector()}
                            {this.props.currentVersion && (<ContentEditor modelDef={this.props.content.modelDefinition} version={this.props.currentVersion} errors={{}} />)}
                            <hr />
                            <p>This is really the crux of the whole system. Everything else is <small>superfluous</small>.</p>
                            <ul>
                                <li>How do you present a really nice method of editing content to the user?</li>
                                <li>How do you manage publishing content?</li>
                                <li>How do you handle multiple versions of content?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentView);
