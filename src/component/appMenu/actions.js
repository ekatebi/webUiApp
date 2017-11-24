/* eslint react/prop-types: 0 no-console: 0 */
import { TOGGLE_MENU_ITEM, RECEIVE_PANE_WIDTH, RESET_MENU_ITEMS,
	MENU_ITEM_MULTIVIEW, MENU_ITEM_WALLS } from './constants';
import { StorageTypes } from '../../constant/storageTypes';
import { ObjectStorage } from '../../service/storage';
import * as mvActions from '../multiview/actions';
import * as wallActions from '../wall/actions';
import { appVersion as appVer } from '../../constant/app';

export function toggleItem(name) {
  return {
    type: TOGGLE_MENU_ITEM,
    name
  };
}

export function onToggleItem(item) {
  return (dispatch, getState) => {
	  dispatch(toggleItem(item));
	  if (item === MENU_ITEM_MULTIVIEW && getState().multiview.editorShowing) {
	  	dispatch(mvActions.showEditor(false));
	  } else if (item === MENU_ITEM_WALLS && getState().wall.editorShowing) {
	  	dispatch(wallActions.showEditor(false));
	  }
	};
}

export function receivePaneWidth(name, width) {
	return {
		type: RECEIVE_PANE_WIDTH,
		name,
		width
	};
}

export function resetMenuItems() {
	return {
		type: RESET_MENU_ITEMS
	};
}

export function onResetMenuItems(item) {
  return (dispatch, getState) => {
	  localStorage.clear();
	  dispatch(resetMenuItems());
	  localStorage.setItem('appVersion', appVer);
	};
}

