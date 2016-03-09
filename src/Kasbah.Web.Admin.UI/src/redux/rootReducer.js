import { combineReducers } from 'redux';
import { routeReducer as router } from 'react-router-redux';
import auth from './modules/auth';
// import content from './modules/content';
import sites from './modules/sites';
// import tree from './modules/tree';
import types from './modules/types';
import contentTree from './modules/content-tree';

export default combineReducers({
  auth,
  // content,
  sites,
  // tree,
  types,
  router,
  contentTree
});
