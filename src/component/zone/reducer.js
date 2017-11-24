/* eslint react/prop-types: 0 no-console: 0 */

import {
  PAGINATION
} from '../../constant/app';

import { NOOP, REQUEST_LIST, RECEIVE_LIST, RECEIVE_LIST_OBJECT, REMOVE_LIST_OBJECT_ITEM,
  RECEIVE_BREADCRUMB, RECEIVE_UNCOLLAPSED,
  RECEIVE_ERROR, RECEIVE_INFO, SHOW_EDITOR, FORM_DATA_CHANGED,
  REQUEST_ITEM, RECEIVE_DEEP_ITEM, SELECT_ZONE, 
  SPINNER, ACTIVE_PAGE_CHANGED } from './constants';

// zone state
const initState = {
  list: [],
  listObject: {},
  uncollapsed: {},
  selected: undefined,
  breadcrumb: [],
  spinner: false,
  fetching: false,
  editorShowing: false,
  formData: { displays: [], walls: [] }, // see actions.js for default
  pageNumber: 1,
  itemsCountPerPage: window.maxLength ? window.maxLength : PAGINATION.itemsCountPerPage
};

export default (state = initState, action) => {

  switch (action.type) {
    case ACTIVE_PAGE_CHANGED:
      return { ...state, pageNumber: action.pageNumber };
    case SPINNER:
      return { ...state, spinner: action.show };
    case REQUEST_LIST:
      return { ...state, fetching: true };
    case RECEIVE_LIST:
      return { ...state, list: [...action.list] }; 
    case RECEIVE_LIST_OBJECT:
      return { ...state, fetching: false,
        listObject: { ...state.listObject, ...action.listObject } }; 
    case REMOVE_LIST_OBJECT_ITEM:
        delete state.listObject[action.id];
        return { ...state, listObject: { ...state.listObject } }; 
    case RECEIVE_DEEP_ITEM:
        return { ...state, fetching: false, deepItem: action.deepItem };
    case RECEIVE_ERROR:
      return { ...state, fetching: false, error: action.error, list: [] };
    case RECEIVE_INFO:
      return { ...state, fetching: false, info: action.info, list: [] };
    case SHOW_EDITOR:
      return { ...state, editorShowing: action.show, formData: action.formData, origFormData: action.origFormData };
    case FORM_DATA_CHANGED:
      return { ...state, formData: action.formData };
    case REQUEST_ITEM:
      return { ...state, formData: { ...state.formData, fetching: true } };
    case SELECT_ZONE:
      return { ...state, selected: action.zone };
    case RECEIVE_BREADCRUMB:
      return { ...state, breadcrumb: action.breadcrumb };
    case RECEIVE_UNCOLLAPSED:
      return { ...state, uncollapsed: { ...action.uncollapsed } };
    default:
      return state;
  }

};
