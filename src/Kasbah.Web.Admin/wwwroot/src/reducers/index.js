import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import nodes from './nodes';
import auth from './auth';

export default combineReducers({
    nodes,
    auth,
    router: routerStateReducer
});
