import React from 'react';
import { connect } from 'react-redux';
import { actions as treeActions } from '../redux/modules/tree';
import { actions as contentActions } from '../redux/modules/content';
import { actions as typeActions } from '../redux/modules/types';
import NodeList from 'components/tree/NodeList';
import ContentEditor from 'components/content/ContentEditor';

const mapStateToProps = (state) => ({
  tree: state.tree,
  content: state.content,
  types: state.types
});

export class ContentView extends React.Component {
    static propTypes = {
      tree: React.PropTypes.object.isRequired,
      content: React.PropTypes.object,
      types: React.PropTypes.object.isRequired,

      fetchChildren: React.PropTypes.func.isRequired,
      toggleNode: React.PropTypes.func.isRequired,
      loadContent: React.PropTypes.func.isRequired,
      loadTypes: React.PropTypes.func.isRequired,
      createNode: React.PropTypes.func.isRequired
    };

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
      let { query } = this.props.location;

      // TODO: limit the node tree to start at the /sites/ node
      this.props.fetchChildren(query.site || null);
      this.props.loadTypes();
    }

    handleAddChild (node, type) {
      var alias = prompt('What shall this node be called?');
      if (alias) {
        this.props.createNode(node, alias, type.id);
      }
    }

    render () {
      let { query } = this.props.location;
      return (
        <div className='container page-content'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-3'>
                <div className='card'>
                  <NodeList
                    parent={query.site || null}
                    nodeTree={this.props.tree}
                    onNodeSelected={this.handleNodeSelected.bind(this)}
                    onToggleNode={this.handleToggleNode.bind(this)}
                    className='node-list list-group list-group-flush' />
                </div>
              </div>

              <div className='col-lg-9'>
                {this.state.selectedNode &&
                  this.props.content.modelDefinition &&
                  this.props.content.data &&
                  <ContentEditor
                    node={this.state.selectedNode.id}
                    modelDefinition={this.props.content.modelDefinition}
                    model={this.props.content.data}
                    errors={{}}
                    types={this.props.types}
                    onAddChild={this.handleAddChild.bind(this)} />}
              </div>
            </div>
          </div>
        </div>);
    }
}

const actions = {
  fetchChildren: treeActions.fetchChildren,
  toggleNode: treeActions.toggleNode,
  loadContent: contentActions.loadContent,
  loadTypes: typeActions.loadTypes,
  createNode: treeActions.createNode
};

export default connect(mapStateToProps, actions)(ContentView);
