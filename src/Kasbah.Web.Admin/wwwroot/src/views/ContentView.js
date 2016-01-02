import React from 'react';
import { connect } from 'react-redux';
import { actions as treeActions } from '../redux/modules/tree';
import { actions as contentActions } from '../redux/modules/content';
import NodeList from 'components/tree/NodeList';
import ContentEditor from 'components/content/ContentEditor';

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

    render () {
      return (
        <div className='container page-content'>
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-lg-3'>
                <div className='card'>
                  <NodeList
                    parent={null}
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
                  <ContentEditor node={this.state.selectedNode.id} modelDefinition={this.props.content.modelDefinition} model={this.props.content.data} errors={{}} />}

                <hr />
                <p>This is really the crux of the whole system. Everything else is <small>superfluous</small>.</p>
                <ul>
                  <li>How do you present a really nice method of editing content to the user?</li>
                  <li>How do you manage publishing content?</li>
                  <li>How do you handle multiple versions of content?</li>
                </ul>

                <h5>Process for authoring content...</h5>

                <ol>
                  <li>
                    Node is created under parent (everything coming off &ldquo;home&rdquo;) for publicly accessible content
                    <ul>
                      <li>non-public content, i.e., reference data, is stored under other parent nodes that are siblings to &ldquo;home&rdquo; (similar to common practise with Sitecore)</li>
                    </ul>
                  </li>
                  <li>During node creation node type is specified</li>
                  <li>Interface is provided to user to fill in content of fields in node type with two options: &ldquo;Save&rdquo; and &ldquo;Save and publish&rdquo; (similar to Umbraco) <i className='fa fa-check' /></li>
                  <li>
                    Clicking &ldquo;Save&rdquo; will have follow as described below for the specified circumstances <i className='fa fa-check' />
                    <ul>
                      <li>if the node is new and no active versions exist, a new version will be created but not set to active <i className='fa fa-check' /></li>
                      <li>if the node already has an active version, and has a newer version than the active one, that newer version will be updated with the changes, the active version will not change <i className='fa fa-check' /></li>
                      <li>if the node already has an active version, and no newer versions exist, a new version will be created, the active version will not change <i className='fa fa-check' /></li>
                    </ul>
                  </li>
                  <li>Clicking “Save and publish” will have the same effect as defined above except the active version will change <i className='fa fa-check' /></li>
                  <li>An option will be available to review other versions in read-only mode, an option will be provided to create a new version as a copy of an old version</li>
                  <li>When selecting a node, the most recent version will be what is presented for editing</li>
                </ol>
              </div>
            </div>
          </div>
        </div>);
    }
}

const actions = {
  fetchChildren: treeActions.fetchChildren,
  toggleNode: treeActions.toggleNode,
  loadContent: contentActions.loadContent
};

export default connect(mapStateToProps, actions)(ContentView);
