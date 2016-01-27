import { handleActions } from 'redux-actions';
import { checkHttpStatus, parseJSON } from '../../utils';
import MimeTypes from 'constants/MimeTypes';

// ------------------------------------
// Constants
// ------------------------------------
const LOAD_SITES_SUCCESS = 'LOAD_SITES_SUCCESS';

// ------------------------------------
// Actions
// ------------------------------------
const loadSitesSuccess = (data) => {
  return {
    type: LOAD_SITES_SUCCESS,
    payload: {
      data
    }
  };
};

export const loadSites = () => {
  return (dispatch) => {
    return fetch(`${API_URL}/api/sites`, { credentials: 'include', headers: { 'Authorization': `Bearer ${localStorage.token}` } })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.success) {
          dispatch(loadSitesSuccess(response));
        }
      });
  };
};

export const actions = {
  loadSites
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export default handleActions({
  [LOAD_SITES_SUCCESS]: (state, { payload }) => {
    return Object.assign({}, state, payload.data);
  }
}, initialState);
