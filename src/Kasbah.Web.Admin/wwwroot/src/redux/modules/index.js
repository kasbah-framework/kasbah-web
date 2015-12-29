import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import { tree, auth, content } from '../../reducers';

export default combineReducers({
  tree,
  auth,
  content,
  router: routeReducer
});
