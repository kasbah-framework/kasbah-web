import { handleActions } from 'redux-actions';
import { fetchWrapper } from 'utils';

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
    return fetchWrapper(`${API_URL}/api/types`)
      .then(response => {
        if (response.success) {
          dispatch(loadTypesSuccess(response));
        }
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
    return { ...state, ...payload.data };
  }
}, initialState);
