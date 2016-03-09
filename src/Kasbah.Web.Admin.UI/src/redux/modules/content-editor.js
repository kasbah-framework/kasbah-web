import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';

// ------------------------------------
// Constants
// ------------------------------------
const SELECT_NODE = 'SELECT_NODE';
const SELECT_NODE_SUCCESS = 'SELECT_NODE_SUCCESS';
const SELECT_NODE_FAILURE = 'SELECT_NODE_FAILURE';
const UPDATE_FIELD = 'UPDATE_FIELD';
const SAVE = 'SAVE';
const SAVE_SUCCESS = 'SAVE_SUCCESS';
const SAVE_FAILURE = 'SAVE_FAILURE';
const UNPUBLISH = 'UNPUBLISH';
const UNPUBLISH_SUCCESS = 'UNPUBLISH_SUCCESS';
const UNPUBLISH_FAILURE = 'UNPUBLISH_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
function selectNode (id) {
  const request = fetchWrapper(`${API_URL}/api/content/${id}`);

  return {
    type: SELECT_NODE,
    payload: request
  };
}

function selectNodeSuccess (data) {
  return {
    type: SELECT_NODE_SUCCESS,
    payload: data
  };
}

function selectNodeFailure (data) {
  return {
    type: SELECT_NODE_FAILURE,
    payload: data
  };
}

function selectNodeDispatcher (id) {
  return (dispatch) => {
    dispatch(selectNode(id)).payload.then((response) => {
      dispatch(selectNodeSuccess({ id, ...response }));
    })
    .catch((response) => {
      dispatch(selectNodeFailure(response));
    });
  };
}

function updateField (field, value) {
  return {
    type: UPDATE_FIELD,
    payload: { field, value }
  };
}

function save (id, values, publish) {
  const body = {
    node: id,
    data: values,
    setActive: publish
  };
  const request = fetchWrapper(`${API_URL}/api/content`, 'POST', body);

  return {
    type: SAVE,
    payload: request
  };
}

function saveSuccess (data) {
  return {
    type: SAVE_SUCCESS,
    payload: { data }
  };
}

function saveFailure (data) {
  return {
    type: SAVE_FAILURE,
    payload: { data }
  };
}

function saveDispatcher (publish) {
  return (dispatch, getState) => {
    const { contentEditor } = getState();
    dispatch(save(contentEditor.node.id, contentEditor.values, publish)).payload.then((response) => {
      dispatch(saveSuccess(response));
    })
    .catch((response) => {
      dispatch(saveFailure(response));
    });
  };
}

function unpublish (id) {
  const request = fetchWrapper(`${API_URL}/api/node/${id}/set-active`, 'POST');

  return {
    type: UNPUBLISH,
    payload: request
  };
}

function unpublishSuccess (data) {
  return {
    type: UNPUBLISH_SUCCESS,
    payload: { data }
  };
}

function unpublishFailure (data) {
  return {
    type: UNPUBLISH_FAILURE,
    payload: { data }
  };
}

function unpublishDispatcher (publish) {
  return (dispatch, getState) => {
    const { contentEditor } = getState();
    dispatch(unpublish(contentEditor.node.id)).payload.then((response) => {
      dispatch(unpublishSuccess(response));
    })
    .catch((response) => {
      dispatch(unpublishFailure(response));
    });
  };
}

export const actions = {
  selectNode,
  selectNodeSuccess,
  selectNodeFailure,
  selectNodeDispatcher,

  updateField,

  save,
  saveSuccess,
  saveFailure,
  saveDispatcher,

  unpublish,
  unpublishSuccess,
  unpublishFailure,
  unpublishDispatcher
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  errorMessage: null,

  node: null,
  values: {},
  model: {}
};

export default handleActions({
  [SELECT_NODE]: (state, { payload }) => {
    return { ...state, isLoading: true };
  },
  [SELECT_NODE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      node: payload.node,
      values: payload.values || {},
      model: payload.model
    };
  },
  [SELECT_NODE_FAILURE]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      errorMessage: payload,
      node: null,
      model: null,
      values: null
    };
  },
  [UPDATE_FIELD]: (state, { payload }) => {
    let update = {};
    update[payload.field] = payload.value;

    return {
      ...state,
      values: {
        ...state.values,
        ...update
      }
    };
  },
  [SAVE]: (state, { payload }) => {
    return {
      ...state,
      isLoading: true
    };
  },
  [SAVE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false
    };
  },
  [SAVE_FAILURE]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false
    };
  },
  [UNPUBLISH]: (state, { payload }) => {
    return {
      ...state,
      isLoading: true
    };
  },
  [UNPUBLISH_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false
    };
  },
  [UNPUBLISH_FAILURE]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false
    };
  }
}, initialState);
