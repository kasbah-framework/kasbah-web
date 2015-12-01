import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from 'actions/tree';
import NodeList from 'components/tree/NodeList';
import { Button, DropDownButton, DropDownButtonItem, DropDownButtonSeparator, States } from 'components/ui';

const mapStateToProps = (state) => ({
    tree: state.tree
});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export class ContentView extends React.Component {
    handleNodeSelected() {

    }

    handleToggleNode(node) {
        this.props.actions.toggleNode(node);
        if (node.expanded) {
            this.props.actions.clearChildren(node);
        }
        else {
            this.props.actions.fetchChildren(node.id);
        }
    }

    componentWillMount() {
        // TODO: limit the node tree to start at the /sites/ node
        this.props.actions.fetchChildren(null);
    }

    handleClick() {

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
                            <p>This is really the crux of the whole system. Everything else is <small>superfluous</small>.</p>
                            <ul>
                                <li>How do you present a really nice method of editing content to the user?</li>
                                <li>How do you manage publishing content?</li>
                                <li>How do you handle multiple versions of content?</li>
                            </ul>
                            <div className='form-group'>
                                <DropDownButton label='Versions' buttonState='default'>
                                    <DropDownButtonItem label='List of versions go here' onClick={this.handleClick.bind(this)} />
                                    <DropDownButtonItem label='List of versions go here' onClick={this.handleClick.bind(this)} />
                                    <DropDownButtonItem label='List of versions go here' onClick={this.handleClick.bind(this)} />
                                    <DropDownButtonSeparator />
                                    <DropDownButtonItem label='New version' onClick={this.handleClick.bind(this)} />
                                </DropDownButton>
                            </div>
                            <div>
                                <Button label='Reset' onClick={this.handleClick.bind(this)} buttonState='secondary' buttonSize='sm' disabled={true} />
                                <Button label='Save' onClick={this.handleClick.bind(this)} buttonState='success' buttonSize='sm' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentView);
