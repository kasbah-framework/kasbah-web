import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';
import tree from './tree';
import auth from './auth';
import content from './content';
import types from './types';
import sites from './sites';

export default combineReducers({
  tree,
  auth,
  content,
  types,
  sites,
  router: routeReducer
});
