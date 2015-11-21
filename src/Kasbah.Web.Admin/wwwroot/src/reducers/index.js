import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import NodeTree from './nodes';

export default combineReducers({
    nodeTree: NodeTree,
    router: routerStateReducer
});
