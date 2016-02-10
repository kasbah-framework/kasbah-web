import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { actions as treeActions } from '../redux/modules/tree';
import { actions as contentActions } from '../redux/modules/content';
import { actions as typeActions } from '../redux/modules/types';
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
      location: React.PropTypes.object.isRequired,

      fetchChildren: React.PropTypes.func.isRequired,
      toggleNode: React.PropTypes.func.isRequired,
      loadContent: React.PropTypes.func.isRequired,
      loadTypes: React.PropTypes.func.isRequired,
      createNode: React.PropTypes.func.isRequired
    };

    constructor () {
      super();

      this.state = { selectedNode: null, currentTab: 'children' };
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

      this.props.loadTypes();

      this.props.fetchChildren(query.node || null);
      if (query.node) {
        this.props.loadContent(query.node);
      }
    }

    componentWillReceiveProps (nextProps) {
      if (this.props.location.query.node !== nextProps.location.query.node) {
        this.props.fetchChildren(nextProps.location.query.node);
        if (nextProps.location.query.node) {
          this.props.loadContent(nextProps.location.query.node);
        }
      }
    }

    handleAddChild () {
      let { query } = this.props.location;

      const type = (this.refs.nodeType.value || '').toString();
      var alias = (this.refs.nodeAlias.value || '').toString();

      if (type === '') {
        this.refs.nodeType.focus();
        return;
      }
      if (alias === '') {
        this.refs.nodeAlias.focus();
        return;
      }
      this.props.createNode(query.node, alias, type);

      this.refs.nodeAlias.value = '';
    }

    render () {
      let { query } = this.props.location;
      return (
        <div className='container'>
            <div className='columns'>
              <div className='column is-3'>

                <div className='menu'>
                  <p className='menu-heading'>
                    {this.props.content.node && this.props.content.node.alias}
                  </p>
                  {this.props.content.node && this.props.content.node.parent &&
                    <Link className='menu-block' to={{ pathname: '/content', query: { node: this.props.content.node.parent } }}>
                      <span className='menu-icon'>
                        <i className='fa fa-level-up'></i>
                      </span>
                      Up one level
                    </Link>}
                  <p className='menu-tabs'>
                    <a href='#' className={this.state.currentTab === 'children' && 'is-active'} onClick={() => this.setState({ currentTab: 'children' })}>Child nodes</a>
                    <a href='#' className={this.state.currentTab === 'hierarchy' && 'is-active'} onClick={() => this.setState({ currentTab: 'hierarchy' })}>Hierarchy</a>
                  </p>

                  {this.state.currentTab === 'children' && Object.keys(this.props.tree.nodes)
                    .map(k => this.props.tree.nodes[k])
                    .filter(ent => ent.parent === query.node || (ent.parent == null && !query.node))
                    .map(ent =>
                      <Link key={ent.id} className='menu-block' to={{ pathname: '/content', query: { node: ent.id } }}>
                        <span className='menu-icon'>
                          <i className={`fa fa-${ent.icon || 'file-text-o'}`}></i>
                        </span>
                        {ent.alias}
                      </Link>
                  )}

                  {this.state.currentTab === 'hierarchy' && this.props.content.hierarchy
                    .map(ent =>
                      <Link key={ent.id} className='menu-block' to={{ pathname: '/content', query: { node: ent.id } }}>
                        <span className='menu-icon'>
                          <i className={`fa fa-${ent.icon || 'file-text-o'}`}></i>
                        </span>
                        {ent.alias}
                      </Link>
                  )}

                  <div className='menu-block'>
                    <p className='control'>
                      <span className={['select', 'is-fullwidth', this.props.types.types ? null : 'is-loading'].join(' ')}>
                        <select ref='nodeType'>
                          <option value=''></option>
                          {this.props.types.types && this.props.types.types.map((ent, index) => <option key={index} value={ent.id}>{ent.displayName}</option>)}
                        </select>
                      </span>
                    </p>
                    <p className='control'>
                      <input className='input' type='text' placeholder='Node alias' ref='nodeAlias' />
                    </p>
                    <button className='button is-primary is-fullwidth' onClick={() => this.handleAddChild()}>
                      Add child
                    </button>
                  </div>
                </div>
              </div>

              <div className='column is-9'>
                {query.node && this.props.content.modelDefinition &&
                  this.props.content.data &&
                  <ContentEditor
                    node={query.node}
                    modelDefinition={this.props.content.modelDefinition}
                    model={this.props.content.data}
                    errors={{}}
                    types={this.props.types}
                    onAddChild={this.handleAddChild.bind(this)} />}
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
