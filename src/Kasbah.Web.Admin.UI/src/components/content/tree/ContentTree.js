import React from 'react';
import NodeList from './NodeList';

export default class ContentTree extends React.Component {
  static propTypes = {
    isLoading: React.PropTypes.bool.isRequired,
    nodesByParent: React.PropTypes.object.isRequired,
    expandedNodes: React.PropTypes.object.isRequired,
    toggleNode: React.PropTypes.func.isRequired,
    selectNode: React.PropTypes.func.isRequired
  };

  static childContextTypes = {
    isLoading: React.PropTypes.bool,
    nodesByParent: React.PropTypes.object,
    expandedNodes: React.PropTypes.object,
    toggleNode: React.PropTypes.func,
    selectNode: React.PropTypes.func
  };

  getChildContext () {
    return {
      isLoading: this.props.isLoading,
      nodesByParent: this.props.nodesByParent,
      expandedNodes: this.props.expandedNodes,
      toggleNode: this.props.toggleNode,
      selectNode: this.props.selectNode
    };
  }

  render () {
    if (this.props.isLoading) return null;

    return (
      <NodeList parent={null} />
    );
  }
};
