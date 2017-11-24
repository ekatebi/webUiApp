/* eslint react/prop-types: 0 no-console: 0 */
import { 
        SET_MAX_COUNT,
        SPINNER,
        ADD_LOG,
        RESET_SCOREBOARD,
        CAPTURE_SCOREBOARD_COUNT,
        SET_COUNT_ERROR,
        SET_COUNT_SUCCESS,
        SET_COUNT_INFO,
        RECEIVE_STORAGE,
        RECEIVE_LIST,
        SHOW_SETTINGS
        } from './constants';

// log state
const initState = {
  list: [],
  maxCount: 150,
  errorCount: 0,
  infoCount: 0,
  successCount: 0,
  previousTotalCount: 0,
  spinner: false,
  showSettings: false
};

export default (state = initState, action) => {

  switch (action.type) {
    case SPINNER:
      return { ...state, spinner: action.show };
    case SHOW_SETTINGS:
      return { ...state, showSettings: action.show };
    case RECEIVE_LIST:
      return { ...state, list: [...action.list] };
    case SET_MAX_COUNT:
      return { ...state, maxCount: action.maxCount };
    case RECEIVE_STORAGE:
      return { ...state, ...action.obj };
    case RESET_SCOREBOARD:
      return { ...state, errorCount: 0, successCount: 0, infoCount: 0 };
    case CAPTURE_SCOREBOARD_COUNT:
      return { ...state, previousTotalCount: (state.errorCount + state.successCount + state.infoCount) };
    case SET_COUNT_ERROR:
      return { ...state, errorCount: action.errorCount };
    case SET_COUNT_SUCCESS:
      return { ...state, successCount: action.successCount };
    case SET_COUNT_INFO:
      return { ...state, infoCount: action.infoCount };
    default:
      return state;
  }

};
