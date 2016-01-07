import { handleActions } from 'redux-actions';
import { checkHttpStatus, parseJSON } from '../../utils';
import MimeTypes from 'constants/MimeTypes';

// ------------------------------------
// Constants
// ------------------------------------
const LOAD_TYPES_SUCCESS = 'LOAD_TYPES_SUCCESS';

// ------------------------------------
// Actions
// ------------------------------------
const loadTypesSuccess = (data) => {
  return {
    type: LOAD_TYPES_SUCCESS,
    payload: {
      data
    }
  };
};

export const loadTypes = () => {
  return (dispatch) => {
    // dispatch(loadTypesRequest());
    return fetch(`${API_URL}/api/types`)
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        if (response.success) {
          dispatch(loadTypesSuccess(response));
        } else {
          // dispatch(loadContentFailure(response));
        }
      })
      .catch(error => {
        // dispatch(loadContentFailure(error.response));
      });
  };
};

export const actions = {
  loadTypes
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {};

export default handleActions({
  [LOAD_TYPES_SUCCESS]: (state, { payload }) => {
    return Object.assign({}, state, payload.data);
  }
}, initialState);