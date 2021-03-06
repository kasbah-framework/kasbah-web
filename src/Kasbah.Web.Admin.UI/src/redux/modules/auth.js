import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';
import decode from 'jwt-decode';

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
export function loginUserSuccess (token, persist) {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token,
      persist
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

export function loginUser (username, password, persist) {
  return (dispatch) => {
    dispatch(loginUserRequest());
    const body = {
      username,
      password,
      persist,
      method: 'password'
    };

    return fetchWrapper(`${API_URL}/api/auth/login`, 'POST', body)
      .then(response => {
        if (response.success) {
          dispatch(loginUserSuccess(response.token, persist));
        } else {
          dispatch(loginUserFailure(response));
        }
      })
      .catch(error => dispatch(loginUserFailure(error.response)));
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
      var token = payload.token;
      var decoded = decode(token);
      if (payload.persist) {
        localStorage.token = token;
      } else {
        sessionStorage.token = token;
      }
      return {
        'isAuthenticating': false,
        'isAuthenticated': true,
        'token': token,
        'userName': decoded.unique_name,
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
    localStorage.removeItem('token');
    return {
      'isAuthenticated': false,
      'token': null,
      'userName': null,
      'errorCode': null,
      'errorMessage': null
    };
  }
}, initialState);
