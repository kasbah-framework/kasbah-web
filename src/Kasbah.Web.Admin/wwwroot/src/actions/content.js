import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    LOAD_CONTENT_REQUEST,
    LOAD_CONTENT_FAILURE,
    LOAD_CONTENT_SUCCESS,
    LOGOUT_USER,
    UPDATE_MODEL,
    SELECT_VERSION,
    ADD_VERSION } from 'constants/content';
import { API_BASE } from 'constants';
import MimeTypes from 'constants/MimeTypes';

export function loadContentSuccess(content) {
    return {
        type: LOAD_CONTENT_SUCCESS,
        payload: {
            content
        }
    }
}

export function loadContentFailure(response) {
    return {
        type: LOAD_CONTENT_FAILURE,
        payload: {
            errorCode: response ? response.errorCode : -1,
            errorMessage: response ? response.errorMessage : 'Something went wrong.'
        }
    }
}

export function loadContentRequest() {
    return {
        type: LOAD_CONTENT_REQUEST
    }
}

export function loadContent(id) {
    return (dispatch) => {
        dispatch(loadContentRequest());
        return fetch(`${API_BASE}/api/content/${id}`)
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(response => {
            if (response.success) {
                dispatch(loadContentSuccess(response));
            }
            else {
                dispatch(loadContentFailure(response));
            }
        })
        .catch(error => {
            dispatch(loadContentFailure(error.response));
        });
    }
}

export function updateModel(field, value) {
    return {
        type: UPDATE_MODEL,
        payload: {
            field,
            value
        }
    }
}

export function selectVersion(version) {
    return {
        type: SELECT_VERSION,
        payload: {
            version
        }
    }
}

export function addVersion() {
    return {
        type: ADD_VERSION,
        payload: {}
    }
}
