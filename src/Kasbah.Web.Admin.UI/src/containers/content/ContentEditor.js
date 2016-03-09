import { connect } from 'react-redux';

import Component from 'components/content/ContentEditor';
import { actions } from 'redux/modules/content-editor';

const mapStateToProps = (state) => {
  return {
    isLoading: state.contentEditor.isLoading,
    node: state.contentEditor.node,
    model: state.contentEditor.model,
    values: state.contentEditor.values
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateField: (field, value) => dispatch(actions.updateField(field, value)),
    save: (publish) => dispatch(actions.saveDispatcher(publish))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
