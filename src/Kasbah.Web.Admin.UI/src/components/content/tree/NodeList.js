import React from 'react';
import Node from './Node';

export default class NodeList extends React.Component {
  static propTypes = {
    parent: React.PropTypes.string
  };

  static contextTypes = {
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    selectNode: React.PropTypes.func.isRequired
  };

  render () {
    return <ul className='node-tree'>
    {(this.context.nodesByParent[this.props.parent] || []).map(ent => (
      <Node key={ent.id} node={ent} />
    ))}
    </ul>;
  }
}
