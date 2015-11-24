import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import tree from './tree';
import auth from './auth';

export default combineReducers({
    tree,
    auth,
    router: routerStateReducer
});
