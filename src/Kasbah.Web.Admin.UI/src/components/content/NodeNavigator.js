import React from 'react';

class NodeList extends React.Component {
  static propTypes = {
    parent: React.PropTypes.string,
    toggleNode: React.PropTypes.func.isRequired,
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired
  };

  render () {
    return <ul className='node-tree'>
    {(this.props.nodesByParent[this.props.parent] || []).map(ent => (
      <Node key={ent.id} node={ent} toggleNode={this.props.toggleNode} nodesByParent={this.props.nodesByParent} expandedNodes={this.props.expandedNodes} />
    ))}
    </ul>;
  }
}

class Node extends React.Component {
  static propTypes = {
    node: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired
  };

  get expanded () {
    return this.props.expandedNodes[this.props.node.id];
  }

  get childTree () {
    if (this.expanded) {
      return <NodeList parent={this.props.node.id} toggleNode={this.props.toggleNode} nodesByParent={this.props.nodesByParent} expandedNodes={this.props.expandedNodes} />;
    }

    return null;
  }

  get toggleButton () {
    const iconClass = 'fa fa-' + (this.expanded ? 'minus-square-o' : 'plus-square-o');
    return <button className='toggle' onClick={() => this.props.toggleNode(this.props.node)}><i className={iconClass} /></button>;
  }

  render () {
    return <li>
      <div>
        <button><i className={`fa fa-${this.props.node.icon || 'file-text-o'}`}></i> {this.props.node.alias}</button>
        {this.toggleButton}
      </div>
      {this.childTree}
    </li>;
  }
}

export default class extends React.Component {
  static propTypes = {
    isLoading: React.PropTypes.bool.isRequired,
    nodesByParent: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    expandedNodes: React.PropTypes.object.isRequired
  };

  render () {
    if (this.props.isLoading) return null;

    return (
      <NodeList parent={null} toggleNode={this.props.toggleNode} nodesByParent={this.props.nodesByParent} expandedNodes={this.props.expandedNodes} />
    );
  }
};
