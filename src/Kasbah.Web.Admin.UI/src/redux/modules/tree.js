import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_NODES = 'RECEIVE_NODES';
export const TOGGLE_NODE = 'TOGGLE_NODE';
export const UPDATE_ITEM = 'UPDATE_ITEM';

// ------------------------------------
// Actions
// ------------------------------------

export const REQUEST_NODES = 'REQUEST_NODES';
function requestNodes (parent) {
  return {
    type: REQUEST_NODES,
    payload: {
      parent
    }
  };
}

function receiveNodes (parent, data) {
  return {
    type: RECEIVE_NODES,
    payload: {
      parent,
      data
    }
  };
}

export const fetchChildren = (parent) => {
  return (dispatch, getState) => {
    dispatch(requestNodes(parent));
    return fetchWrapper(`${API_URL}/api/children?id=${parent}`)
      .then(json => dispatch(receiveNodes(parent, json)));
  };
};

export function toggleNode (node) {
  return dispatch => {
    dispatch({
      type: TOGGLE_NODE,
      payload: {
        node
      }
    });
  };
}

export const NODE_CREATED = 'NODE_CREATED';
function notifyNodeCreated (id) {
  return {
    type: NODE_CREATED,
    payload: {
      id
    }
  };
}

export function createNode (parent, alias, type) {
  return dispatch => {
    return fetchWrapper(`${API_URL}/api/node`, 'POST', { parent, alias, type })
      .then(json => {
        dispatch(notifyNodeCreated(json));
        dispatch(fetchChildren(parent));
      });
  };
}

export const NODE_DELETED = 'NODE_DELETED';
function notifyNodeDeleted (id) {
  return {
    type: NODE_DELETED,
    payload: {
      id
    }
  };
}

export function deleteNode (id) {
  return dispatch => {
    return fetchWrapper(`${API_URL}/api/node`, 'DELETE', { id })
      .then(resp => {
        dispatch(notifyNodeDeleted(id));
      });
  };
}

export const actions = {
  fetchChildren,
  toggleNode,
  createNode,
  deleteNode
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  nodes: {},
  versions: {},
  items: {}
};

export default handleActions({
  [RECEIVE_NODES]: (state, { payload }) => {
    let newNodes = { nodes: {} };

    for (var i = 0; i < payload.data.length; i++) {
      newNodes.nodes[payload.data[i].id] = payload.data[i];
    }

    return Object.assign({}, state, newNodes);
  },
  [TOGGLE_NODE]: (state, { payload }) => {
    const id = payload.node.id;

    const node = Object.assign({}, state.nodes[id], { expanded: !state.nodes[id].expanded });
    const update = {};
    update[id] = node;

    const nodes = Object.assign({}, state.nodes, update);

    return Object.assign({}, state, { nodes });
  }
}, initialState);
