import React from 'react';
import NodeList from './NodeList';

export default class Node extends React.Component {
  static propTypes = {
    node: React.PropTypes.object.isRequired
  };

  static contextTypes = {
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    selectNode: React.PropTypes.func.isRequired
  };

  get expanded () {
    return this.context.expandedNodes[this.props.node.id];
  }

  get childTree () {
    if (this.expanded) {
      return <NodeList parent={this.props.node.id} />;
    }

    return null;
  }

  get toggleButton () {
    const iconClass = 'fa fa-' + (this.expanded ? 'minus-square-o' : 'plus-square-o');
    return <button className='toggle' onClick={() => this.context.toggleNode(this.props.node)}><i className={iconClass} /></button>;
  }

  render () {
    return <li>
      <div>
        <button onClick={() => this.context.selectNode(this.props.node.id)}><i className={`fa fa-${this.props.node.icon || 'file-text-o'}`}></i> {this.props.node.alias}</button>
        {this.toggleButton}
      </div>
      {this.childTree}
    </li>;
  }
}
