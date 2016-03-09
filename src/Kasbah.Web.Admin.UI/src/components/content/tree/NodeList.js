import React from 'react';
import Node from './Node';

export default class NodeList extends React.Component {
  static propTypes = {
    parent: React.PropTypes.string,
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    selectNode: React.PropTypes.func.isRequired
  };

  render () {
    return <ul className='node-tree'>
    {(this.props.nodesByParent[this.props.parent] || []).map(ent => (
      <Node key={ent.id} node={ent} toggleNode={this.props.toggleNode} selectNode={this.props.selectNode} nodesByParent={this.props.nodesByParent} expandedNodes={this.props.expandedNodes} />
    ))}
    </ul>;
  }
}
