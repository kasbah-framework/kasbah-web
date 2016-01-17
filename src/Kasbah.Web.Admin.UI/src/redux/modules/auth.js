import { handleActions } from 'redux-actions';
import MimeTypes from '../../constants/MimeTypes';
import { parseJSON, checkHttpStatus } from 'utils';

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGOUT_USER = 'LOGOUT_USER';

// ------------------------------------
// Actions
// ------------------------------------
export function loginUserSuccess (token) {
  return {
      type: LOGIN_USER_SUCCESS,
      payload: {
          token: token
        }
    };
}

export function loginUserFailure (response) {
  return {
      type: LOGIN_USER_FAILURE,
      payload: {
          errorCode: response ? response.errorCode : -1,
          errorMessage: response ? response.errorMessage : 'Something went wrong.'
        }
    };
}

export function loginUserRequest () {
  return {
      type: LOGIN_USER_REQUEST
    };
}

export function logout () {
  return {
      type: LOGOUT_USER
    };
}

export function logoutAndRedirect () {
  return (dispatch, state) => {
      dispatch(logout());
      dispatch(pushState(null, '/login'));
    };
}

export function loginUser (username, password, persist) {
  return (dispatch) => {
      dispatch(loginUserRequest());
      return fetch(`${API_URL}/api/auth/login`, {
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
    };
}

export const actions = {
  loginUser
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  errorCode: null,
  errorMessage: null
};

export default handleActions({
  [LOGIN_USER_REQUEST]: (state, { payload }) => {
    return {
      token: null,
      userName: null,
      isAuthenticated: false,
      isAuthenticating: true,
      errorCode: null,
      errorMessage: null
    };
  },
  [LOGIN_USER_SUCCESS]: (state, { payload }) => {
    try {
      return {
        'isAuthenticating': false,
        'isAuthenticated': true,
        'token': null,
        'userName': null,
        'errorCode': null,
        'errorMessage': null
      };
    } catch (e) {
      return {
        'isAuthenticating': false,
        'isAuthenticated': false,
        'token': null,
        'userName': null,
        'errorCode': -1,
        'errorMessage': `Invalid access token. Please log in again.`
      };
    }
  },
  [LOGIN_USER_FAILURE]: (state, { payload }) => {
    return {
      'isAuthenticating': false,
      'isAuthenticated': false,
      'token': null,
      'userName': null,
      'errorCode': payload.errorCode,
      'errorMessage': payload.errorMessage
    };
  },
  [LOGOUT_USER]: (state, { payload }) => {
    return {
      'isAuthenticated': false,
      'token': null,
      'userName': null,
      'errorCode': null,
      'errorMessage': null
    };
  }
}, initialState);
