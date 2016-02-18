import React from 'react';
import NodeList from 'components/tree/NodeList';
import { actions as treeActions } from '../../../redux/modules/tree';
import { connect } from 'react-redux';

class NodeSelectSingle extends React.Component {
    static alias = 'node_select_single';
    static propTypes = {
      field: React.PropTypes.object.isRequired,
      value: React.PropTypes.any,
      onChange: React.PropTypes.func.isRequired,
      fetchChildren: React.PropTypes.func.isRequired,
      toggleNode: React.PropTypes.func.isRequired,
      tree: React.PropTypes.object.isRequired
    };

    componentWillMount () {
      this.props.fetchChildren(null);
    }

    handleNodeSelected (node, ev) {
      ev.preventDefault(); // TODO: figure out why this is necessary

      this.props.onChange(this.props.field, node.id);
    }

    handleToggleNode (node, ev) {
      ev.preventDefault(); // TODO: figure out why this is necessary

      this.props.toggleNode(node);
      if (!node.expanded) {
        this.props.fetchChildren(node.id);
      }
    }

    render () {
      return (<div>
        <NodeList
          parent={null}
          nodeTree={this.props.tree}
          onNodeSelected={this.handleNodeSelected.bind(this)}
          onToggleNode={this.handleToggleNode.bind(this)}
          className='node-list' />
          <pre>Selected node: {this.props.value || '(none selected)'}</pre>
        </div>);
    }
}

const mapStateToProps = (state) => ({
  tree: state.tree
});
const actions = {
  fetchChildren: treeActions.fetchChildren,
  toggleNode: treeActions.toggleNode
};

export default connect(mapStateToProps, actions)(NodeSelectSingle);
