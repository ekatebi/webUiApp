/* eslint react/prop-types: 0 no-console: 0 */
import { NOOP, REQUEST_LIST, RECEIVE_LIST, RECEIVE_MODEL, 
  RECEIVE_ERROR, SHOW_EDITOR, FORM_DATA_CHANGED,
  REQUEST_ITEM, SPINNER } from './constants';

// wall state
const initState = {
  list: [],
  model: {},
  fetching: false,
  spinner: false,
  editorShowing: false,
  formData: undefined // see actions.js for default
};

export default (state = initState, action) => {

  switch (action.type) {
    case SPINNER:
      return { ...state, spinner: action.show };
    case REQUEST_LIST:
      return { ...state, fetching: true, model: {} };
    case RECEIVE_LIST:
      return { ...state, fetching: false, list: action.list, model: {} };
    case RECEIVE_MODEL:
        return { ...state, model: { ...state.model, [action.wallName]: action.model } };
    case RECEIVE_ERROR:
      return { ...state, fetching: false, error: action.error, list: [], model: {} };
    case SHOW_EDITOR:
      {
        const matrix = [];
        for (let row = 0; row < action.formData.rows; row++) {
          matrix.push([...action.formData.matrix[row]]);
        }
        return { ...state, editorShowing: action.show, formData: action.formData, matrix };
      }
    case FORM_DATA_CHANGED:
      {
        /*
        if (state.formData.rows !== action.formData.rows || state.formData.columns !== action.formData.columns) {          
          const matrix = [];
          for (let row = 0; row < action.formData.rows && row < state.matrix.length; row++) {
            if (action.formData.columns >= state.matrix[row].length) {
              matrix.push([...state.matrix[row]]);
            }
          }
          return { ...state, formData: { ...action.formData, matrix } };
        }
        */
        return { ...state, formData: action.formData };
      }
    case REQUEST_ITEM:
      return { ...state, formData: { ...state.formData, fetching: true } };
    default:
      return state;
  }

};
