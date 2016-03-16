import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';

// ------------------------------------
// Constants
// ------------------------------------
const FETCH_CHILDREN = 'FETCH_CHILDREN';
const FETCH_CHILDREN_SUCCESS = 'FETCH_CHILDREN_SUCCESS';
const FETCH_CHILDREN_FAILURE = 'FETCH_CHILDREN_FAILURE';

// ------------------------------------
// Actions
// ------------------------------------
function fetchChildren (parent) {
  const request = fetchWrapper(`${API_URL}/api/children?id=${parent}`);

  return {
    type: FETCH_CHILDREN,
    payload: request
  };
}

function fetchChildrenSuccess (data) {
  return {
    type: FETCH_CHILDREN_SUCCESS,
    payload: data
  };
}

function fetchChildrenFailure (data) {
  return {
    type: FETCH_CHILDREN_FAILURE,
    payload: data
  };
}

function fetchChildrenDispatcher (parent) {
  return (dispatch) => {
    dispatch(fetchChildren(parent)).payload.then((response) => {
      dispatch(fetchChildrenSuccess({ parent, data: response }));
    })
    .catch((response) => {
      dispatch(fetchChildrenFailure(response));
    });
  };
}

export const actions = {
  fetchChildrenDispatcher,
  fetchChildren,
  fetchChildrenSuccess,
  fetchChildrenFailure
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  errorMessage: null,
  nodesByParent: {}
};

export default handleActions({
  [FETCH_CHILDREN]: (state, { payload }) => {
    return { ...state, isLoading: true };
  },
  [FETCH_CHILDREN_SUCCESS]: (state, { payload }) => {
    let nodesByParent = { ...state.nodesByParent };
    nodesByParent[payload.parent || null] = payload.data;

    return { ...state, isLoading: false, nodesByParent };
  },
  [FETCH_CHILDREN_FAILURE]: (state, { payload }) => {
    return { ...state, isLoading: false, errorMessage: payload };
  }
}, initialState);
