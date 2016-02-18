import React from 'react';
import { Link } from 'react-router';

class NodeNavigator extends React.Component {
  static propTypes = {
    content: React.PropTypes.object.isRequired,
    types: React.PropTypes.object.isRequired,
    tree: React.PropTypes.object.isRequired,

    onCreateNode: React.PropTypes.func.isRequired
  };

  constructor () {
    super();

    this.state = { selectedNode: null, currentTab: 'children' };
  }

  handleAddChild () {
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
    this.props.onCreateNode(this.props.content.node.id, alias, type);

    this.refs.nodeAlias.value = '';
  }

  render () {
    return (
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

        {this.state.currentTab === 'children' &&
          this.props.content.node &&
          Object.keys(this.props.tree.nodes)
          .map(k => this.props.tree.nodes[k])
          .filter(ent => ent.parent === this.props.content.node.id || (ent.parent == null && !this.props.content.node.id))
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
      </div>);
  }
}

export default NodeNavigator;
