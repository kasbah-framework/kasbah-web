import React from 'react';
import NodeList from './NodeList';

export default class extends React.Component {
  static propTypes = {
    isLoading: React.PropTypes.bool.isRequired,
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    selectNode: React.PropTypes.func.isRequired
  };

  render () {
    if (this.props.isLoading) return null;

    return (
      <NodeList parent={null} toggleNode={this.props.toggleNode} selectNode={this.props.selectNode} nodesByParent={this.props.nodesByParent} expandedNodes={this.props.expandedNodes} />
    );
  }
};
