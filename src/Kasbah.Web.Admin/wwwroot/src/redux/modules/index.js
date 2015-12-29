import { combineReducers } from 'redux'
import { routeReducer } from 'redux-simple-router'
import counter from './counter'
import { tree, auth, content } from '../../reducers';

export default combineReducers({
  counter,
  tree,
  auth,
  content,
  router: routeReducer
})
