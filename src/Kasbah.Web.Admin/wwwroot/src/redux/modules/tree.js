import { handleActions } from 'redux-actions';

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ------------------------------------
// Constants
// ------------------------------------
export const RECEIVE_NODES = 'RECEIVE_NODES';
export const TOGGLE_NODE = 'TOGGLE_NODE';
export const CLEAR_CHILDREN = 'CLEAR_CHILDREN';
export const RECEIVE_NODE_VERSIONS = 'RECEIVE_NODE_VERSIONS';
export const RECEIVE_NODE_VERSION = 'RECEIVE_NODE_VERSION';
export const UPDATE_ITEM = 'UPDATE_ITEM';
export const NODE_VERSION_ADD_FIELD = 'NODE_VERSION_ADD_FIELD';

// ------------------------------------
// Actions
// ------------------------------------
import fetch from 'isomorphic-fetch';

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
    return fetch(`${API_URL}/api/children?id=${parent}`)
      .then(response => response.json())
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

export function clearChildren (node) {
  return dispatch => {
    dispatch({
      type: CLEAR_CHILDREN,
      payload: {
        node
      }
    });
  };
}

export const REQUEST_NODE_VERSIONS = 'REQUEST_NODE_VERSIONS';
function requestNodeVersions (node) {
  return {
    type: REQUEST_NODE_VERSIONS,
    payload: {
      node
    }
  };
}

function receiveNodeVersions (node, data) {
  return {
    type: RECEIVE_NODE_VERSIONS,
    payload: {
      node,
      data
    }
  };
}

export function fetchNodeVersions (node) {
  return dispatch => {
    dispatch(requestNodeVersions(node));
    return fetch(`${API_URL}/api/versions/${node}`)
      .then(response => response.json())
      .then(json => dispatch(receiveNodeVersions(node, json)));
  };
}

function receiveNodeVersion (id, version, data) {
  return {
    type: RECEIVE_NODE_VERSION,
    payload: {
      id,
      version,
      data
    }
  };
}

export function fetchNodeVersion (id, version) {
  return dispatch => {
    dispatch(requestNodeVersions(id, version));

    return fetch(`${API_URL}/api/version/${id}/${version}`)
      .then(response => response.json())
      .then(json => dispatch(receiveNodeVersion(id, version, json)));
  };
}

function notifyUpdateItem (node, version, field, value) {
  return {
    type: UPDATE_ITEM,
    payload: {
      node,
      version,
      field,
      value
    }
  };
}

export function updateItem (node, version, field, value) {
  return dispatch => {
    dispatch(notifyUpdateItem(node, version, field, value));
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
  const options = {
    method: 'POST',
    body: JSON.stringify({ parent, alias, type }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    return fetch(`${API_URL}/api/node`, options)
      .then(response => response.json())
      .then(json => {
        dispatch(notifyNodeCreated(json));
        dispatch(fetchChildren(parent));
      });
  };
}

export const NODE_VERSION_CREATED = 'NODE_VERSION_CREATED';
function notifyNodeVersionCreated (node, id) {
  return {
    type: NODE_VERSION_CREATED,
    payload: {
      id
    }
  };
}

export function createNodeVersion (node) {
  const options = {
    method: 'POST',
    body: JSON.stringify({}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  return dispatch => {
    return fetch(`${API_URL}/api/node/${node}/version`, options)
      .then(response => response.json())
      .then(json => {
        dispatch(notifyNodeVersionCreated(json));
        dispatch(fetchNodeVersions(node));
      });
  };
}

export function addField (node, version, name) {
  return dispatch => dispatch({
    type: NODE_VERSION_ADD_FIELD,
    payload: {
      node,
      version,
      name
    }
  });
}

export function setActiveVersion (id, version) {
  const options = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return dispatch => {
    return fetch(`${API_URL}/api/node/${id}/set-active/${version}`, options)
      .then(response => response.json())
      .then(json => {
          // dispatch(notifyNodeVersionCreated(json));
      });
  };
}

export function save (node, version, values) {
  const options = {
    method: 'POST',
    body: JSON.stringify(values),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };

  return dispatch => {
    return fetch(`${API_URL}/api/save/${node}/${version}`, options)
      .then(response => response.json())
      .then(json => {

      });
  };
}

export const actions = {
  fetchChildren,
  toggleNode,
  createNode
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = { nodes: {}, versions: {}, items: {} };
export default handleActions({
  [RECEIVE_NODES]: (state, { payload }) => {
    let ret = clone(state);

    for (var i = 0; i < payload.data.length; i++) {
      ret.nodes[payload.data[i].id] = payload.data[i];
    }

    return ret;
  },
  [TOGGLE_NODE]: (state, { payload }) => {
    let ret = clone(state);

    ret.nodes[payload.node.id].expanded = !ret.nodes[payload.node.id].expanded;

    return ret;
  },
  [CLEAR_CHILDREN]: (state, { payload }) => {
    let ret = clone(state);

    for (var k in ret.nodes) {
      if (ret.nodes[k].parent === payload.node.id && ret.nodes[k].id !== null) {
        delete ret[k];
      }
    }

    return ret;
  },
  [RECEIVE_NODE_VERSIONS]: (state, { payload }) => {
    let ret = clone(state);

    ret.versions[payload.node] = payload.data;

    return ret;
  },
  [RECEIVE_NODE_VERSION]: (state, { payload }) => {
    let ret = clone(state);

    ret.items[payload.id] = ret.items[payload.id] || {};

    ret.items[payload.id][payload.version] = payload.data;

    return ret;
  },
  [UPDATE_ITEM]: (state, { payload }) => {
    let ret = clone(state);

    ret.items[payload.node][payload.version][payload.field] = payload.value;

    return ret;
  },
  [NODE_VERSION_ADD_FIELD]: (state, { payload }) => {
    let ret = clone(state);

    ret.items[payload.node][payload.version][payload.name] = null;

    return ret;
  }
}, initialState);
