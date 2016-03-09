import React from 'react';
import NodeList from './NodeList';

export default class Node extends React.Component {
  static propTypes = {
    node: React.PropTypes.object.isRequired,
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    selectNode: React.PropTypes.func.isRequired
  };

  get expanded () {
    return this.props.expandedNodes[this.props.node.id];
  }

  get childTree () {
    if (this.expanded) {
      return <NodeList parent={this.props.node.id} toggleNode={this.props.toggleNode} selectNode={this.props.selectNode} nodesByParent={this.props.nodesByParent} expandedNodes={this.props.expandedNodes} />;
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
        <button onClick={() => this.props.selectNode(this.props.node.id)}><i className={`fa fa-${this.props.node.icon || 'file-text-o'}`}></i> {this.props.node.alias}</button>
        {this.toggleButton}
      </div>
      {this.childTree}
    </li>;
  }
}
