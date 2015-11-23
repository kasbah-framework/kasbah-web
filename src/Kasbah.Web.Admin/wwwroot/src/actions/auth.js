import { checkHttpStatus, parseJSON } from '../utils';
import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_FAILURE,
    LOGIN_USER_SUCCESS,
    LOGOUT_USER } from '../constants/Auth';
import { pushState } from 'redux-router';

const MimeTypes = {
    'text': {
        'plain': 'text/plain'
    },
    'application': {
        'json': 'application/json'
    }
}

export function loginUserSuccess(token) {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export function loginUserFailure(error) {
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
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

export function loginUser(email, password, redirect) {

    return function(dispatch) {
        dispatch(loginUserRequest());
        return fetch(`{ApiBase}/api/auth/get-token`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': MimeTypes.application.json,
                'Content-Type': MimeTypes.application.json
            },
            body: JSON.stringify({email: email, password: password})
        })
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(response => {
            let redirect = redirect || '/';
            dispatch(loginUserSuccess(response.token));
            dispatch(pushState(null, redirect));
        })
        .catch(error => {
            dispatch(loginUserFailure(error));
        });
    }
}

/*
export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data: data
        }
    }
}

export function fetchProtectedDataRequest() {
  return {
    type: FETCH_PROTECTED_DATA_REQUEST
  }
}

export function fetchProtectedData(token) {

    return (dispatch, state) => {
        dispatch(fetchProtectedDataRequest());
        return fetch('http://localhost:3000/getData/', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(checkHttpStatus)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.data));
            })
            .catch(error => {
                if(error.response.status === 401) {
                  dispatch(loginUserFailure(error));
                  dispatch(pushState(null, '/login'));
                }
            })
       }
}
*/
