import { connect } from 'react-redux';

import Component from 'views/ContentView';
import { actions as contentTreeActions } from 'redux/modules/content-tree';

// TODO: not entirely certain about this one...

const mapDispatchToProps = (dispatch) => {
  return {
    init: (parent) => {
      dispatch(contentTreeActions.fetchChildrenDispatcher(null));
    }
  };
};

export default connect(null, mapDispatchToProps)(Component);
