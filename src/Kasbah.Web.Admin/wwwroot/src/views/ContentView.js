import React from 'react';
import { connect } from 'react-redux';
import { actions as treeActions } from '../redux/modules/tree';
import { actions as contentActions } from '../redux/modules/content';
import NodeList from 'components/tree/NodeList';
import ContentEditor from 'components/content/ContentEditor';
import { DropDownButton, DropDownButtonItem, DropDownButtonSeparator } from 'components/ui';

const mapStateToProps = (state) => ({
  tree: state.tree,
  content: state.content
});

export class ContentView extends React.Component {
    static propTypes = {
      tree: React.PropTypes.object,
      content: React.PropTypes.object,

      fetchChildren: React.PropTypes.func,
      toggleNode: React.PropTypes.func,
      loadContent: React.PropTypes.func,
      selectVersion: React.PropTypes.func,
      addVersion: React.PropTypes.func
    }

    constructor () {
      super();

      this.state = { selectedNode: null };
    }

    handleNodeSelected (node) {
      this.setState({ selectedNode: node });
      this.props.loadContent(node.id);
    }

    handleToggleNode (node) {
      this.props.toggleNode(node);
      if (!node.expanded) {
        this.props.fetchChildren(node.id);
      }
    }

    componentWillMount () {
      // TODO: limit the node tree to start at the /sites/ node
      this.props.fetchChildren(null);
    }

    handleSelectVersion (version) {
      this.props.selectVersion(version);
    }

    handleNewVersion () {
      this.props.addVersion(this.state.selectedNode.id);
    }

    _renderVersionSelector () {
      if (!this.props.content || !this.props.content.content) { return null; }
      return (
            <div className='form-group'>
                <DropDownButton label='Versions' buttonState='default'>
                    {this.props.content.content.versions.map((ent, index) => <DropDownButtonItem key={index} onClick={this.handleSelectVersion.bind(this, ent)}>{ent.id ? ent.id : <em>Unsaved version</em>} {ent.isActive && <span className='label label-success'>active</span>}</DropDownButtonItem>)}
                    {this.props.content.content.versions.length > 0 && <DropDownButtonSeparator />}
                    <DropDownButtonItem onClick={this.handleNewVersion.bind(this)}>New version</DropDownButtonItem>
                </DropDownButton>
            </div>);
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
                                {this.props.tree && <NodeList
                                    parent={null}
                                    nodeTree={this.props.tree}
                                    onNodeSelected={this.handleNodeSelected.bind(this)}
                                    onToggleNode={this.handleToggleNode.bind(this)}
                                    className='node-list list-group list-group-flush' />}
                            </div>
                        </div>

                        <div className='col-lg-9'>
                            {this._renderVersionSelector()}
                            {this.props.content && this.props.content.currentVersion && (<ContentEditor modelDef={this.props.content.content.modelDefinition} version={this.props.content.currentVersion} errors={{}} />)}
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

const actions = {
  fetchChildren: treeActions.fetchChildren,
  toggleNode: treeActions.toggleNode,
  loadContent: contentActions.loadContent,
  selectVersion: contentActions.selectVersion,
  addVersion: contentActions.addVersion
};

export default connect(mapStateToProps, actions)(ContentView);
