import { createReducer } from '../utils';
import {
    LOAD_CONTENT_REQUEST,
    LOAD_CONTENT_SUCCESS,
    LOAD_CONTENT_FAILURE,
    UPDATE_MODEL,
    SELECT_VERSION,
    ADD_VERSION } from '../constants/content';
import { pushState } from 'redux-router';
import jwtDecode from 'jwt-decode';

const initialState = {
    isLoading: false,
    content: null,
    currentVersion: null,
    errorCode: null,
    errorMessage: null
};

export default createReducer(initialState, {
    [LOAD_CONTENT_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isLoading': true,
            'currentVersion': null,
            'errorCode': null,
            'errorMessage': null
        });
    },
    [LOAD_CONTENT_SUCCESS]: (state, payload) => {
        try {
            return Object.assign({}, state, {
                'isLoading': false,
                'content': payload.content,
                'currentVersion': null,
                'errorCode': null,
                'errorMessage': null
            });
        } catch (e) {
            return Object.assign({}, state, {
                'isLoading': false,
                'content': null,
                'currentVersion': null,
                'errorCode': -1,
                'errorMessage': `Error processing data: ${e}`
            });
        }
    },
    [LOAD_CONTENT_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isLoading': false,
            'content': null,
            'currentVersion': null,
            'errorCode': payload.errorCode,
            'errorMessage': payload.errorMessage,
        });
    },
    [UPDATE_MODEL]: (state, payload) => {
        const updates = Object.assign({}, state.currentVersion.values);
        updates[payload.field.alias] = payload.value;
        return Object.assign({}, state, {
            'currentVersion': Object.assign({}, state.currentVersion, { values: updates })
        });
    },
    [SELECT_VERSION]: (state, payload) => {
        return Object.assign({}, state, {
            'currentVersion': Object.assign({}, payload.version)
        });
    },
    [ADD_VERSION]: (state, payload) => {
        return Object.assign({}, state, {
            'content': Object.assign({}, state.content, { versions: [...state.content.versions, { id: null, values: { } }] })
        });
    }
});
