import { createReducer } from '../utils';
import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER } from '../constants/auth';
// import { pushState } from 'redux-router';
// import jwtDecode from 'jwt-decode';

const initialState = {
  token: null,
  userName: null,
  isAuthenticated: false,
  isAuthenticating: false,
  errorCode: null,
  errorMessage: null
};

export default createReducer(initialState, {
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
});
