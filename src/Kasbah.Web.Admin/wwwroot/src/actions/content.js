import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    LOAD_CONTENT_REQUEST,
    LOAD_CONTENT_FAILURE,
    LOAD_CONTENT_SUCCESS,
    LOGOUT_USER,
    UPDATE_MODEL,
    SELECT_VERSION,
    ADD_VERSION,
    SAVE_CONTENT_REQUEST,
    SAVE_CONTENT_FAILURE,
    SAVE_CONTENT_SUCCESS } from 'constants/content';
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

export function addVersion(node) {
    return {
        type: ADD_VERSION,
        payload: {
            node
        }
    }
}


export function saveContentSuccess(content) {
    return {
        type: SAVE_CONTENT_SUCCESS,
        payload: {
            content
        }
    }
}

export function saveContentFailure(response) {
    return {
        type: SAVE_CONTENT_FAILURE,
        payload: {
            errorCode: response ? response.errorCode : -1,
            errorMessage: response ? response.errorMessage : 'Something went wrong.'
        }
    }
}

export function saveContentRequest() {
    return {
        type: SAVE_CONTENT_REQUEST
    }
}

export function saveContent(version) {
    return (dispatch) => {
        dispatch(loadContentRequest());
        return fetch(`${API_BASE}/api/content`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': MimeTypes.application.json,
                'Content-Type': MimeTypes.application.json
            },
            body: JSON.stringify({
                version
            })
        })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(response => {
            if (response.success) {
                dispatch(saveContentSuccess(response));
            }
            else {
                dispatch(saveContentFailure(response));
            }
        })
        .catch(error => {
            dispatch(saveContentFailure(error.response));
        });
    }
}
