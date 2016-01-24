import React from 'react';
import NodeList from 'components/tree/NodeList';
import { actions as treeActions } from '../../../redux/modules/tree';
import { connect } from 'react-redux';

class NodeSelectMulti extends React.Component {
    static alias = 'node_select_multi';
    static propTypes = {
      field: React.PropTypes.object.isRequired,
      value: React.PropTypes.any,
      onChange: React.PropTypes.func.isRequired
    };

    componentWillMount () {
      this.props.fetchChildren(null);
    }

    handleNodeSelected (node, ev) {
      ev.preventDefault(); // TODO: figure out why this is necessary

      const newVal = [... new Set([...this.props.value || [], node.id])];

      this.props.onChange(this.props.field, newVal);
    }

    handleToggleNode (node, ev) {
      ev.preventDefault(); // TODO: figure out why this is necessary

      this.props.toggleNode(node);
      if (!node.expanded) {
        this.props.fetchChildren(node.id);
      }
    }

    handleRemoveClick(index, ev) {
      ev.preventDefault();

      const newVal = [...this.props.value];
      newVal.splice(index, 1);

      this.props.onChange(this.props.field, newVal);
    }

    renderList () {
      if (!this.props.value || this.props.value.length == 0) {
        return <pre>Nothing selected</pre>;
      }

      return <ul className='list-group'>
        {this.props.value.map((id, index) => <li key={index} className='list-group-item'>
          <button className='pull-right btn btn-danger btn-sm' onClick={this.handleRemoveClick.bind(this, index)}>Remove</button>
          {id}
          </li>)}
      </ul>;
    }

    render () {
      return (<div>
        <NodeList
          parent={null}
          nodeTree={this.props.tree}
          onNodeSelected={this.handleNodeSelected.bind(this)}
          onToggleNode={this.handleToggleNode.bind(this)}
          className='node-list' />

          {this.renderList()}
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

export default connect(mapStateToProps, actions)(NodeSelectMulti);
