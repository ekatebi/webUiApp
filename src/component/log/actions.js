/* eslint react/prop-types: 0 no-console: 0 */
import { onToggleItem } from '../appMenu/actions';
import {
  MENU_ITEM_LOGS
} from '../appMenu/constants';

import { StorageTypes } from '../../constant/storageTypes';
import { ObjectStorage } from '../../service/storage';
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

const storage = new ObjectStorage(localStorage, StorageTypes.Log);

const defaultLogObject = {
  list: [],
  maxCount: 150,
  errorCount: 0,
  successCount: 0,
  infoCount: 0
};

function showSpinner(show = true) {
  return {
    type: SPINNER,
    show
  };
}

function showSettings(show = true) {
  return {
    type: SHOW_SETTINGS,
    show
  };
}

function receiveStorage(obj) {
  return {
    type: RECEIVE_STORAGE,
    obj
  };
}

function receiveList(list) {
  return {
    type: RECEIVE_LIST,
    list
  };
}

function addLog(log) {
  return {
    type: ADD_LOG,
    log
  };
}

function resetScoreboard() {
  return {
    type: RESET_SCOREBOARD
  };
}

function captureScoreboardCount() {
  return {
    type: CAPTURE_SCOREBOARD_COUNT
  };
}

function setErrorCount(errorCount) {
  return {
    type: SET_COUNT_ERROR,
    errorCount
  };
}

function setSuccessCount(successCount) {
  return {
    type: SET_COUNT_SUCCESS,
    successCount
  };
}

function setInfoCount(infoCount) {
  return {
    type: SET_COUNT_INFO,
    infoCount
  };
}

function setMaxCount(maxCount) {
  return {
    type: SET_MAX_COUNT,
    maxCount
  };
}

export function onRequestStorage() {
  return (dispatch, getState) => {

    dispatch(showSpinner());

    let logObject = storage.get();

    if (!logObject) {
      logObject = defaultLogObject;
    }

    dispatch(receiveStorage(logObject));

    dispatch(showSpinner(false));
  };
}

export function onAddLog(log) {
  return (dispatch, getState) => {

//    console.log('onAddLog', log.type, log.msg);

    log.timeInMs = Date.now();

    const logState = getState().log;

    let list = logState.list;

    list.unshift(log);

    if (list.length > logState.maxCount) {
      list = list.slice(0, logState.maxCount);
    }

    dispatch(receiveList(list));

    if (log.type === 'error') {
      const errorCount = logState.errorCount + 1;
      dispatch(setErrorCount(errorCount));
      storage.set({ ...storage.get(), list, errorCount });
    } else if (log.type === 'success') {
      const successCount = logState.successCount + 1;
      dispatch(setSuccessCount(successCount));
      storage.set({ ...storage.get(), list, successCount });
    } else if (log.type === 'info') {
      const infoCount = logState.infoCount + 1;
      dispatch(setInfoCount(infoCount));
      storage.set({ ...storage.get(), list, infoCount });
    } else {
      const error = `unknown log type of ${log.type} encountered`;
      throw error;
    }

  };
}

export function onSetMaxCount(maxCount) {
  return (dispatch, getState) => {

    const logState = getState().log;

    dispatch(setMaxCount(maxCount));

    let list = logState.list;

    if (list.length > maxCount) {
      list = list.slice(0, maxCount);
      dispatch(receiveList(list));
      storage.set({ ...storage.get(), maxCount, list });
    } else {
      storage.set({ ...storage.get(), maxCount });
    }

  };
}

export function onResetScoreboard() {
  return (dispatch, getState) => {
    const logState = getState().log;
    const appMenuState = getState().appMenu;

    // Is the log panel open?
    const isLogPanelOpen = appMenuState.menu.APP_MENU__ITEM_LOGS.isSelected;

    if (!isLogPanelOpen) {
      dispatch(onToggleItem(MENU_ITEM_LOGS));
    }

    dispatch(captureScoreboardCount());
    dispatch(resetScoreboard());
    storage.set({ ...storage.get(), errorCount: 0, successCount: 0, infoCount: 0 });
  };
}

export function onClearLogs() {
  return (dispatch, getState) => {
    dispatch(receiveList([]));
    dispatch(resetScoreboard());
  };
}
