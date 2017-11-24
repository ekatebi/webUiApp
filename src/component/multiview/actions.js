import { fetchMvs, updateMv, deleteMv, joinMvToDisplay } from './fetch';
import * as deviceActions from '../device/actions';

import {
  REQUEST_LIST,
  RECEIVE_LIST,
  RECEIVE_MODEL,
  RECEIVE_ERROR,
  RECEIVE_DRAGGING,
  RECEIVE_DRAG_INFO,
  RECEIVE_DROP_INFO,
  RECEIVE_CAN_DROP,
  RECEIVE_GRID_REC,
  RECEIVE_POINT_REC,
  RECEIVE_REMOVE_WIN,
  ITEM_CHANGED,
  SHOW_EDITOR,
  X_RAY_VISION,
  REQUEST_SAVE_ITEM,
  REQUEST_REMOVE_ITEM,
  LOAD_PATTERN,
  TOGGLE_ASPECT_RATIO,
  ENABLE_SAVE_AS,
  ENABLE_RENAME,
  SELECT_MULTIVIEW
} from './constants';

const mv = 'multiview';

const defaultItem = {
      gen: {
        name: ''
      },
      windows: []
    };

export function requestList() {
  return {
    type: REQUEST_LIST
  };
}

export function selectMultiview(multiview) {
  return {
    type: SELECT_MULTIVIEW,
    multiview
  };
}

export function onSelectMultiview(multiview) {
  return (dispatch, getState) => {
  	dispatch(selectMultiview(multiview));
  	dispatch(deviceActions.selectSources());
  };
}

const listAdapter = (list) => {
  const newList = [];

  list.forEach((item, index) => {
//    console.log('list item', index, JSON.stringify(item, 0, 2));
    let audioSourceIndex = -1;

    if (item.audio && item.audio.sourceWindow && item.audio.sourceWindow !== 'none') {
      // audioSourceIndex is zero based. sourceWindow is one based.
      audioSourceIndex = Number(item.audio.sourceWindow) - 1;
    }

    if (item.window && Array.isArray(item.window)) {
//      const wins = [...item.window];
      const wins = item.window.map((win, index) => {
        return { ...win, posX: Number(win.percentPosX), posY: Number(win.percentPosY),
          sizeX: Number(win.percentSizeX), sizeY: Number(win.percentSizeY),
          layer: Number(win.layer),
          audioSource: index === audioSourceIndex };
      });
      delete item.window;
      newList.push({ ...item, windows: [...wins] });
    } else if (item.window && typeof(item.window) === 'object') {
//      console.error(`multiview ${item.gen.name} has non-array windows, ${JSON.stringify(item, 0, 2)}`);
      const wins = Object.keys(item.window).map((key, index) => {
        const win = item.window[key];
        return { ...win, posX: Number(win.percentPosX), posY: Number(win.percentPosY),
          sizeX: Number(win.percentSizeX), sizeY: Number(win.percentSizeY),
          layer: Number(win.layer),
          audioSource: index === audioSourceIndex };
      });
      delete item.window;
      newList.push({ ...item, windows: [...wins] });
    } else {
      newList.push({ ...item, windows: [] });
    }
  });

  return newList;
};

export function receiveList(list) {
  return {
    type: RECEIVE_LIST,
    list: listAdapter(list)
  };
}

export function receiveError(error) {
  return {
    type: RECEIVE_ERROR,
    error
  };
}

export function receiveXrayVision(xRayVision = false) {
  return {
    type: X_RAY_VISION,
    xRayVision
  };
}

export function toggleAspectRatio() {
  return {
    type: TOGGLE_ASPECT_RATIO
  };
}

export function enableSaveAs() {
  return {
    type: ENABLE_SAVE_AS
  };
}

export function enableRename(rename) {
  return {
    type: ENABLE_RENAME,
    rename
  };
}

export function showEditor(show, item = defaultItem, index = -1) {
//  console.log('showEditor action', show, item, index);
  return {
    type: SHOW_EDITOR,
    show, // true = show, false = hide
    item: { ...item, index, dirty: false }
  };
}

export function itemChanged(item, allowDirty = true) {
  return {
    type: ITEM_CHANGED,
    item,
    allowDirty
  };
}

export function receiveDragging(dragging) {
  return {
    type: RECEIVE_DRAGGING,
    dragging
  };
}

export function receiveRemoveWin(winIndex) {
  return {
    type: RECEIVE_REMOVE_WIN,
    winIndex
  };
}

function requestSaveItem() {
  return {
    type: REQUEST_SAVE_ITEM
  };
}

function requestRemoveItem(index) {
  return {
    type: REQUEST_REMOVE_ITEM,
    index
  };
}

export function loadPattern(pattern) {
  return {
    type: LOAD_PATTERN,
    pattern
  };
}

export function receiveDropInfo(dragItem, percentDiff) {
  return {
    type: RECEIVE_DROP_INFO,
    dragItem,
    percentDiff
  };
}

export function receiveCanDrop(canDrop, clientOffset, differenceFromInitialOffset) {
  return {
    type: RECEIVE_CAN_DROP,
    canDrop,
    clientOffset,
    differenceFromInitialOffset
  };
}

export function receiveGridRec(gridRec) {
//  console.log('receiveGridRec', gridRec);
  return {
    type: RECEIVE_GRID_REC,
    gridRec
  };
}

export function receivePointRec(pointRec) {
//  console.log('receivePointRec', pointRec);
  return {
    type: RECEIVE_POINT_REC,
    pointRec
  };
}

function reportError(msg, json) {
  let err = false;
  json.responses.forEach((resp) => {
    if (resp.errors.length !== 0) {
      err = true;
      appAlert.error(`${resp.errors.join(', ')}, ${msg} ${mv} ${resp.command}`);
    } else if (resp.warnings.length !== 0) {
      appAlert.info(`WARNING: ${resp.warnings.join(', ')}, ${msg} ${mv} ${resp.command}`);
    }
  });
  return err;
}

export function onRequestJoinMvToDisplay(mvName, decoderConfig) {
  return (dispatch, getState) => {

//    console.log('onRequestJoinMvToDisplay', mvName, decoderName);

  const decoderName = decoderConfig.gen.name;

   dispatch(deviceActions.animateDeviceBorder(decoderConfig.gen.mac, true));

   joinMvToDisplay(mvName, decoderName)
      .then(resp => resp.json())
	    .catch((err) => {
	      appAlert.error(err);    
	    })
      .then(json => {
//        console.log('onRequestJoinMvToDisplay json', JSON.stringify(json, 0, 2));
//        dispatch(onRequestList());
        if (!reportError('failed to join', json)) {
          appAlert.success(`Success in joining ${mv} ${mvName} to display ${decoderName}`);
        } else {
          appAlert.error(`Failed to join ${mv} ${mvName} to display ${decoderName}`);
        }

      })
      .catch(error => {
        appAlert.error(`${error.toString()}, Failed to join ${mv} ${mvName} to display ${decoderName}`);
//        dispatch(receiveError(error));
      })
      .then(() => {
//        dispatch(showSpinner(false));
      });

  };
}

function itemToCmd(item, maxWinCount) {
  const name = item.gen.name;

//  console.log('itemToCmd', item, item.windows.length);

  let cmd = 'commands=';

  if (item.index < 0) {
    cmd += `create ${mv} ${name}`;

    if (item.windows.length > 0) {
      cmd += '\n';
    }
  }

  let audioSourceWindowIndex = 'none';

  item.windows.forEach((win, index) => {
    cmd += `set ${mv} ${name} window-number ${index + 1} encoder-name ${win['encoder-name'] ? win['encoder-name'] : 'none'} ` +
      `position-x ${win.posX} position-y ${win.posY} size-x ${win.sizeX} size-y ${win.sizeY} ` +
      `layer ${!win.layer ? 1 : win.layer}`;

    if (win.audioSource === true) {
      // index is zero based. audioSourceWindowIndex is one based.
      audioSourceWindowIndex = index + 1;
    }

    if (index < item.windows.length - 1) {
      cmd += '\n';
    }
   });

  if (item.index >= 0) {
    for (let index = item.windows.length; index < maxWinCount; index++) {

      if (index > 0 && index < maxWinCount) {
        cmd += '\n';
      }

      cmd += `delete ${mv}-window ${name} window ${index + 1} no-print-error`;
    }
  }

  cmd += `\nset ${mv} ${name} audio-source window-number ${audioSourceWindowIndex}`;

//  console.log(`${mv} cmd ${cmd}`);

  return cmd;
}

export function onRequestList() {
  return (dispatch, getState) => {

    const { item, maxWins } = getState().multiview;
    dispatch(requestList());
    fetchMvs()
      .then(resp => resp.json())
	    .catch((err) => {
	      appAlert.error(err);    
	    })
      .then(json => {
//        console.log('onRequestList json', json, JSON.stringify(json, 0, 2));

        if (json.status === 'Success') {
          const list = json.responses[0].text;

//          console.log('onRequestList list', list, JSON.stringify(list, 0, 2));

          dispatch(receiveList(list));
        } else {
          const error = json.status;
          appAlert.error(`${error.toString()}, failed to fetch multiviews, ${json}`);
          dispatch(receiveError(error));
        }

      })
      .catch(error => {
        appAlert.error(`${error.toString()}, failed to fetch multiviews`);
        dispatch(receiveError(error));
      })
      .then(() => {
//        dispatch(showSpinner(false));
      });
  };
}


export function onRequestDeleteItem(name) {
  return (dispatch, getState) => {

    const { item, maxWins } = getState().multiview;

//    console.log('onRequestDeleteItem', name);
//    dispatch(requestSaveItem());
    deleteMv(name)
      .then(resp => resp.json())
	    .catch((err) => {
	      appAlert.error(err);    
	    })
      .then(json => {
//        console.log('onRequestDeleteItem json', JSON.stringify(json, 0, 2));

        if (!reportError('failed to delete', json)) {
          appAlert.success(`Success in deleting ${mv} ${name}`);
        } else {
          appAlert.error(`Failed to delete ${mv} ${name}`);
        }

        dispatch(onRequestList());
      })
      .catch(error => {
        appAlert.error(`${error.toString()}, failed to delete ${mv} ${name}`);
//        dispatch(receiveError(error));
      })
      .then(() => {
//        dispatch(showSpinner(false));
      });
  };
}

export function onRequestSaveItem() {
  return (dispatch, getState) => {

    const { item, maxWins, rename } = getState().multiview;

//    console.log('onRequestSaveItem item', item);
//    dispatch(requestSaveItem());

  if (rename) {
    dispatch(onRequestDeleteItem(rename));
  }

  const cmd = itemToCmd(item, maxWins);

//    console.log('onRequestSaveItem cmd', cmd);

    updateMv(cmd)
      .then(resp => resp.json())
	    .catch((err) => {
	      appAlert.error(err);    
	    })
      .then(json => {
//        console.log('onRequestSaveItem', JSON.stringify(json, 0, 2));

        if (!reportError('failed to save', json)) {
          appAlert.success(`Success in saving ${mv} ${item.gen.name}`);
        } else {
          appAlert.error(`Failed to save ${mv} ${item.gen.name}, ${cmd}`);
        }

        dispatch(showEditor(false));
        dispatch(onRequestList());
      })
      .catch(error => {
        appAlert.error(`${error.toString()}, failed to save ${mv} ${item.gen.name}`);
//        dispatch(receiveError(error));
      })
      .then(() => {
//        dispatch(showSpinner(false));
      });
  };
}
