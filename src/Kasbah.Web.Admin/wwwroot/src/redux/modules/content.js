import { handleActions } from 'redux-actions';
import { checkHttpStatus, parseJSON } from '../../utils';
import MimeTypes from 'constants/MimeTypes';
import fetch from 'isomorphic-fetch';

// ------------------------------------
// Constants
// ------------------------------------
export const LOAD_CONTENT_REQUEST = 'LOAD_CONTENT_REQUEST';
export const LOAD_CONTENT_SUCCESS = 'LOAD_CONTENT_SUCCESS';
export const LOAD_CONTENT_FAILURE = 'LOAD_CONTENT_FAILURE';
export const SAVE_CONTENT_REQUEST = 'SAVE_CONTENT_REQUEST';
export const SAVE_CONTENT_SUCCESS = 'SAVE_CONTENT_SUCCESS';
export const SAVE_CONTENT_FAILURE = 'SAVE_CONTENT_FAILURE';
export const SET_ACTIVE_VERSION_REQUEST = 'SET_ACTIVE_VERSION_REQUEST';
export const SET_ACTIVE_VERSION_SUCCESS = 'SET_ACTIVE_VERSION_SUCCESS';
export const SET_ACTIVE_VERSION_FAILURE = 'SET_ACTIVE_VERSION_FAILURE';
export const UPDATE_MODEL = 'UPDATE_MODEL';
export const SELECT_VERSION = 'SELECT_VERSION';
export const ADD_VERSION = 'ADD_VERSION';

// ------------------------------------
// Actions
// ------------------------------------

export function loadContentSuccess (content) {
  return {
    type: LOAD_CONTENT_SUCCESS,
    payload: {
      content
    }
  };
}

export function loadContentFailure (response) {
  return {
    type: LOAD_CONTENT_FAILURE,
    payload: {
      errorCode: response ? response.errorCode : -1,
      errorMessage: response ? response.errorMessage : 'Something went wrong.'
    }
  };
}

export function loadContentRequest () {
  return {
    type: LOAD_CONTENT_REQUEST
  };
}

export function loadContent (id) {
  return (dispatch) => {
    dispatch(loadContentRequest());
    return fetch(`${API_URL}/api/content/${id}`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.success) {
          dispatch(loadContentSuccess(response));
        } else {
          dispatch(loadContentFailure(response));
        }
      })
      .catch(error => {
        dispatch(loadContentFailure(error.response));
      });
  };
}

export function updateModel (field, value) {
  return {
    type: UPDATE_MODEL,
    payload: {
      field,
      value
    }
  };
}

export function saveContentSuccess (content) {
  return {
    type: SAVE_CONTENT_SUCCESS,
    payload: {
      content
    }
  };
}

export function saveContentFailure (response) {
  return {
    type: SAVE_CONTENT_FAILURE,
    payload: {
      errorCode: response ? response.errorCode : -1,
      errorMessage: response ? response.errorMessage : 'Something went wrong.'
    }
  };
}

export function saveContentRequest () {
  return {
    type: SAVE_CONTENT_REQUEST
  };
}

export function saveContent (node, data, setActive) {
  return (dispatch) => {
    dispatch(saveContentRequest());
    return fetch(`${API_URL}/api/content`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': MimeTypes.application.json,
        'Content-Type': MimeTypes.application.json
      },
      body: JSON.stringify({
        node, data, setActive
      })
    })
    .then(checkHttpStatus)
    .then(parseJSON)
    .then(response => {
      if (response.success) {
        dispatch(saveContentSuccess(response));
      } else {
        dispatch(saveContentFailure(response));
      }
    })
    .catch(error => {
      dispatch(saveContentFailure(error.response));
    });
  };
}

export const actions = {
  loadContent,
  updateModel,
  saveContent
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  modelDefinition: null,
  data: null,
  errorCode: null,
  errorMessage: null
};

export default handleActions({
  [LOAD_CONTENT_REQUEST]: (state, { payload }) => {
    return Object.assign({}, state, {
      'isLoading': true,
      'currentVersion': null,
      'errorCode': null,
      'errorMessage': null
    });
  },
  [LOAD_CONTENT_SUCCESS]: (state, { payload }) => {
    try {
      return Object.assign({}, state, {
        'isLoading': false,
        'modelDefinition': payload.content.modelDefinition,
        'data': payload.content.data || {},
        'errorCode': null,
        'errorMessage': null
      });
    } catch (e) {
      return Object.assign({}, state, {
        'isLoading': false,
        'modelDefinition': null,
        'data': null,
        'errorCode': -1,
        'errorMessage': `Error processing data: ${e}`
      });
    }
  },
  [LOAD_CONTENT_FAILURE]: (state, { payload }) => {
    return Object.assign({}, state, {
      'isLoading': false,
      'content': null,
      'currentVersion': null,
      'errorCode': payload.errorCode,
      'errorMessage': payload.errorMessage
    });
  },
  [UPDATE_MODEL]: (state, { payload }) => {
    const updates = Object.assign({}, state.data);
    updates[payload.field.alias] = payload.value;
    return Object.assign({}, state, { data: updates, '$dirty': true });
  },
  [ADD_VERSION]: (state, { payload }) => {
    return Object.assign({}, state, {
      'content': Object.assign({}, state.content, { versions: [...state.content.versions, { id: null, nodeId: payload.node, values: { } }] })
    });
  }
}, initialState);
