import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import tree from './tree';
// import auth from './auth';
import content from './content';

export default combineReducers({
  tree,
  // auth,
  content,
  router: routeReducer
});
