import { connect } from 'react-redux';
import Component from 'components/content/tree/ContentTree';
import { actions } from 'redux/modules/content-tree';
import { actions as contentEditorActions } from 'redux/modules/content-editor';

const mapStateToProps = (state) => {
  return {
    isLoading: state.contentTree.isLoading,
    nodesByParent: state.contentTree.nodesByParent,
    expandedNodes: state.contentTree.expandedNodes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchChildren: (node) => dispatch(actions.fetchChildrenDispatcher(node.id)),
    selectNode: (node) => dispatch(contentEditorActions.selectNodeDispatcher(node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
