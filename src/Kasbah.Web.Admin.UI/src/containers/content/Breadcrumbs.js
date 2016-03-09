import { connect } from 'react-redux';
import Component from 'components/content/Breadcrumbs';

const mapStateToProps = (state) => {
  return {
    isLoading: state.content.isLoading,
    errorMessage: state.content.errorMessage,
    selectedNode: state.content.selectedNode,
    selectedNodeHierarchy: state.content.selectedNodeHierarchy
  };
};

export default connect(mapStateToProps)(Component);
