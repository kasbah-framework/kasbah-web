import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import tree from './tree';
import auth from './auth';
import content from './content';

export default combineReducers({
    tree,
    auth,
    content,
    router: routerStateReducer
});
