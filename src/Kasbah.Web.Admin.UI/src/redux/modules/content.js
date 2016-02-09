import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';

// ------------------------------------
// Constants
// ------------------------------------
export const LOAD_CONTENT_REQUEST = 'LOAD_CONTENT_REQUEST';
export const LOAD_CONTENT_SUCCESS = 'LOAD_CONTENT_SUCCESS';
export const LOAD_CONTENT_FAILURE = 'LOAD_CONTENT_FAILURE';
export const SAVE_CONTENT_REQUEST = 'SAVE_CONTENT_REQUEST';
export const SAVE_CONTENT_SUCCESS = 'SAVE_CONTENT_SUCCESS';
export const SAVE_CONTENT_FAILURE = 'SAVE_CONTENT_FAILURE';
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
    return fetchWrapper(`${API_URL}/api/content/${id}`, 'GET')
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

    const body = { node, data, setActive };

    return fetchWrapper(`${API_URL}/api/content`, 'POST', body)
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

function unpublish (node) {
  return (dispatch) => {
    return fetchWrapper(`${API_URL}/api/node/${node}/set-active`, 'GET')
      .then(response => {
      })
      .catch(error => {
      });
  };
}

export const actions = {
  loadContent,
  updateModel,
  saveContent,
  unpublish
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  modelDefinition: null,
  data: null,
  node: null,
  errorCode: null,
  errorMessage: null
};

export default handleActions({
  [LOAD_CONTENT_REQUEST]: (state, { payload }) => {
    return Object.assign({}, state, {
      'isLoading': true,
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
        'node': payload.content.node,
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
