import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';

// ------------------------------------
// Constants
// ------------------------------------
const FETCH_CHILDREN = 'FETCH_CHILDREN';
const FETCH_CHILDREN_SUCCESS = 'FETCH_CHILDREN_SUCCESS';
const FETCH_CHILDREN_FAILURE = 'FETCH_CHILDREN_FAILURE';

const FETCH_NODE = 'FETCH_NODE';
const FETCH_NODE_SUCCESS = 'FETCH_NODE_SUCCESS';
const FETCH_NODE_FAILURE = 'FETCH_NODE_FAILURE';

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

function fetchNode (id) {
  const request = fetchWrapper(`${API_URL}/api/content/${id}`);

  return {
    type: FETCH_NODE,
    payload: request
  };
}

function fetchNodeSuccess (data) {
  return {
    type: FETCH_NODE_SUCCESS,
    payload: data
  };
}

function fetchNodeFailure (data) {
  return {
    type: FETCH_NODE_FAILURE,
    payload: data
  };
}

export const actions = {
  fetchChildren,
  fetchChildrenSuccess,
  fetchChildrenFailure,

  fetchNode,
  fetchNodeSuccess,
  fetchNodeFailure
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  errorMessage: null,

  nodesByParent: {}, // for "NodeNavigator"
  selectedNode: null, // for "Breadcrumbs" and "ContentEditor",
  selectedNodeHierarchy: [],
  values: {}, // for "ContentEditor"
  model: {} // for "ContentEditor"
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
  },

  [FETCH_NODE]: (state, { payload }) => {
    return { ...state, isLoading: true };
  },
  [FETCH_NODE_SUCCESS]: (state, { payload }) => {
    return {
      ...state,
      isLoading: false,
      selectedNode: payload.node,
      selectedNodeHierarchy: payload.hierarchy,
      model: payload.model,
      values: payload.values
    };
  },
  [FETCH_NODE_FAILURE]: (state, { payload }) => {
    return { ...state, isLoading: false, errorMessage: payload };
  }
}, initialState);
