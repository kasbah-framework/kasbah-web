import { connect } from 'react-redux';
import Component from 'components/content/NodeNavigator';
import { actions as contentTreeActions } from 'redux/modules/content-tree';

const mapStateToProps = (state) => {
  return {
    isLoading: state.contentTree.isLoading,
    nodesByParent: state.contentTree.nodesByParent,
    expandedNodes: state.contentTree.expandedNodes
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNode: (node) => dispatch(contentTreeActions.toggleNodeDispatcher(node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
