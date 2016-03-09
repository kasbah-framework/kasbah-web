import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';

// ------------------------------------
// Constants
// ------------------------------------
const SELECT_NODE = 'SELECT_NODE';
const SELECT_NODE_SUCCESS = 'SELECT_NODE_SUCCESS';
const SELECT_NODE_FAILURE = 'SELECT_NODE_FAILURE';

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
      dispatch(selectNodeSuccess({ id, data: response }));
    })
    .catch((response) => {
      dispatch(selectNodeFailure(response));
    });
  };
}

export const actions = {
  selectNode,
  selectNodeSuccess,
  selectNodeFailure,
  selectNodeDispatcher
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
      values: payload.values,
      model: payload.model
    };
  },
  [SELECT_NODE_FAILURE]: (state, { payload }) => {
    return { ...state, isLoading: false, errorMessage: payload };
  }
}, initialState);
