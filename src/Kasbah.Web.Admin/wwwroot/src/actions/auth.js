import fetch from 'isomorphic-fetch';
import { checkHttpStatus, parseJSON } from '../utils';
import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_FAILURE,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER } from 'constants/auth';
import { API_BASE } from 'constants';
import { pushState } from 'redux-router';
import MimeTypes from 'constants/MimeTypes';

export function loginUserSuccess(token) {
    return {
        type: LOGIN_USER_SUCCESS,
        payload: {
            token: token
        }
    }
}

export function loginUserFailure(response) {
    return {
        type: LOGIN_USER_FAILURE,
        payload: {
            errorCode: response ? response.errorCode : -1,
            errorMessage: response ? response.errorMessage : 'Something went wrong.'
        }
    }
}

export function loginUserRequest() {
    return {
        type: LOGIN_USER_REQUEST
    }
}

export function logout() {
    return {
        type: LOGOUT_USER
    }
}

export function logoutAndRedirect() {
    return (dispatch, state) => {
        dispatch(logout());
        dispatch(pushState(null, '/login'));
    }
}

export function loginUser(username, password, persist) {
    return (dispatch) => {
        dispatch(loginUserRequest());
        return fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': MimeTypes.application.json,
                'Content-Type': MimeTypes.application.json
            },
            body: JSON.stringify({
                username,
                password,
                persist,
                method: 'password'
            })
        })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(response => {
            if (response.success) {
                dispatch(loginUserSuccess(response.token));
            }
            else {
                dispatch(loginUserFailure(response));
            }
        })
        .catch(error => {
            dispatch(loginUserFailure(error.response));
        });
    }
}
