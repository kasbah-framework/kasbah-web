import { handleActions } from 'redux-actions';
import MimeTypes from '../../constants/MimeTypes';

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
    };
}

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  errorCode: null,
  errorMessage: null
};

export default handleActions({
  [LOGIN_USER_REQUEST]: (state, payload) => {
    return Object.assign({}, state, {
      'isAuthenticating': true,
      'errorCode': null,
      'errorMessage': null
    });
  },
  [LOGIN_USER_SUCCESS]: (state, payload) => {
    localStorage.setItem('token', payload.token);
    try {
        // let decoded = jwtDecode(payload.token);
      return Object.assign({}, state, {
        'isAuthenticating': false,
        'isAuthenticated': true,
        'token': payload.token,
        'userName': 'unknown', // decoded.userName,
        'errorCode': null,
        'errorMessage': null
      });
    } catch (e) {
      localStorage.removeItem('token');
      return Object.assign({}, state, {
        'isAuthenticating': false,
        'isAuthenticated': false,
        'token': null,
        'userName': null,
        'errorCode': -1,
        'errorMessage': `Invalid access token. Please log in again.`
      });
    }
  },
  [LOGIN_USER_FAILURE]: (state, payload) => {
    localStorage.removeItem('token');
    return Object.assign({}, state, {
      'isAuthenticating': false,
      'isAuthenticated': false,
      'token': null,
      'userName': null,
      'errorCode': payload.errorCode,
      'errorMessage': payload.errorMessage
    });
  },
  [LOGOUT_USER]: (state, payload) => {
    localStorage.removeItem('token');
    return Object.assign({}, state, {
      'isAuthenticated': false,
      'token': null,
      'userName': null,
      'errorCode': null,
      'errorMessage': null
    });
  }
}, initialState);
