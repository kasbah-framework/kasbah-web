import React from 'react';
import NodeList from './NodeList';

export default class ContentTree extends React.Component {
  static propTypes = {
    parent: React.PropTypes.string,
    isLoading: React.PropTypes.bool.isRequired,
    nodesByParent: React.PropTypes.object.isRequired,
    selectNode: React.PropTypes.func.isRequired,
    fetchChildren: React.PropTypes.func.isRequired
  };

  static childContextTypes = {
    isLoading: React.PropTypes.bool,
    nodesByParent: React.PropTypes.object,
    expandedNodes: React.PropTypes.object,
    toggleNode: React.PropTypes.func,
    selectNode: React.PropTypes.func
  };

  constructor () {
    super();

    this.state = { expandedNodes: {} };
  }

  getChildContext () {
    return {
      isLoading: this.props.isLoading,
      nodesByParent: this.props.nodesByParent,
      expandedNodes: this.state.expandedNodes,
      toggleNode: (node) => this.toggleNode(node),
      selectNode: this.props.selectNode
    };
  }

  toggleNode (node) {
    let diff = {};
    diff[node.id] = !this.state.expandedNodes[node.id];

    this.props.fetchChildren(node);

    this.setState({ expandedNodes: { ...this.state.expandedNodes, ...diff } });
  }

  render () {
    if (this.props.isLoading) return null;

    return (
      <NodeList parent={this.props.parent || null} />
    );
  }
};
