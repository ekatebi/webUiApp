/* eslint react/prop-types: 0 no-console: 0 */
import * as deviceActions from '../device/actions';

import { NOOP, REQUEST_LIST, RECEIVE_LIST, RECEIVE_MODEL, SPINNER,
  RECEIVE_ERROR, SHOW_EDITOR, FORM_DATA_CHANGED,
  REQUEST_ITEM } from './constants';
import { fetchWalls, updateWall, deleteWall, joinSrcToWall } from '../../service/apiFetch/wall';

function noop() {
  return {
    type: NOOP
  };
}

function showSpinner(show = true) {
  return {
    type: SPINNER,
    show
  };
}

function requestList() {
  return {
    type: REQUEST_LIST
  };
}

function receiveList(list) {
  return {
    type: RECEIVE_LIST,
    list // array
  };
}

function receiveModel(wallName, model) {
  return {
    type: RECEIVE_MODEL,
    wallName,
    model
  };
}

function receiveError(error) {
  return {
    type: RECEIVE_ERROR,
    error // string
  };
}

const defaultFormData = {
  index: -1,
  name: '',
  videoSourceMac: '',
  columns: 0,
  rows: 0,
  bezel: { top: 0, bottom: 0, left: 0, right: 0 },
  matrix: []
};

function itemToFormData(item, index = -1) {

  if (!item) {
    return defaultFormData;
  }

/*
"decodersRow1": {
    "col1": "jag-dec2",
    "col2": "001EC0F67225",
    "col3": "jag-dec"
  },
*/

  const makeRow = (itemRow) => {
    let index = 1;
    const row = [];
    while (itemRow[`col${index}`]) {
      row.push(itemRow[`col${index}`]);
      index++;
    }
    return row;
  };

  const makeMatrix = (item) => {
    let index = 1;
    const matrix = [];
    while (item[`decodersRow${index}`]) {
      matrix.push(makeRow(item[`decodersRow${index}`]));
      index++;
    }
    return matrix;
  };


  const formData = {}; // { ...defaultFormData };

  formData.index = index;
  formData.name = item.gen.name;
  formData.videoSourceMac = item.gen.videoSourceMac;
  formData.columns = item.gen.numDisplayCols;
  formData.rows = item.gen.numDisplayRows;
  formData.bezel = { ...item.bezel };

  formData.matrix = makeMatrix(item);

//  console.log('wall item', item, formData);

  return formData;
}

const getFirstDecoder = (item) => {

//  console.log('getFirstDecoder');

  let row = 1;
  while (item[`decodersRow${row}`]) {
    let col = 1;
    while (item[`decodersRow${row}`][`col${col}`]) {
      if (item[`decodersRow${row}`][`col${col}`] !== 'none') {
        return item[`decodersRow${row}`][`col${col}`];
      }
      col++;
    }
    row++;
  }

  return undefined;
};

function onGetModels(walls) {

//  console.log('onGetModels', walls);

  return (dispatch, getState) => {
    const { decoders } = getState().device;

    walls.forEach((wall) => {

//      console.log('onGetModels walls.forEach', wall);

      const decoderName = getFirstDecoder(wall);

//      console.log('onGetModels', decoderName, wall);

      if (decoderName) {

        if (decoders && decoders.config && decoders.config.info
          && decoders.config.info.text && decoders.config.info.text.length > 0) {
            const decoderConfig = decoders.config.info.text.find((config) => {
            return config.gen.name === decoderName;
          });

          if (decoderConfig.gen.model) {
            // Substring of Zyper4K, ZyperUHD, or ZyperHD: start=5 to the end of the string.
            dispatch(receiveModel(wall.gen.name, decoderConfig.gen.model.substring(5)));
          }
        } else {
            dispatch(receiveModel(wall.gen.name, undefined));
        }

      }

    });

  };

}

function onAddModels(walls, resolve, reject) {

//  console.log('onGetModels', walls);

  return (dispatch, getState) => {
    const { decoders } = getState().device;

    if (decoders && decoders.config && decoders.config.info
      && decoders.config.info.text && decoders.config.info.text.length > 0) {
      const list = walls.map((wall) => {

  //      console.log('onGetModels walls.forEach', wall);

        const decoderName = getFirstDecoder(wall);

  //      console.log('onGetModels', decoderName, wall);

        if (decoderName) {

          const decoderConfig = decoders.config.info.text.find((config) => {
            return config.gen.name === decoderName;
          });

            if (decoderConfig.gen.model) {
              // Substring of Zyper4K, ZyperUHD, or ZyperHD: start=5 to the end of the string.
              wall.model = decoderConfig.gen.model.substring(5);
            }

        }
        return wall;
      });

      dispatch(receiveList(list));
    } else {
      dispatch(receiveList(walls));
    }

    resolve(false);
  };

}
/*
commands:create video-wall mywall2
set video-wall mywall2 2 2 0 0 0 0 // col, row, top, bot, left, right
set video-wall-decoder 0:1e:c0:f6:a6:ab mywall2 1 1
set video-wall-decoder 0:1e:c0:f6:a5:8e mywall2 1 2
set video-wall-decoder 0:1e:c0:f6:54:33 mywall2 2 1
set video-wall-decoder ff:0:0:0:22:14 mywall2 2 2
*/

function formDataToCmd(formData) {
  const name = `\"${formData.name}\"`;
  let cmd = 'commands=';

  if (formData.index < 0) {
    cmd += `create video-wall ${name} \n`;
  }

  cmd += `set video-wall ${name} ${formData.rows} ${formData.columns} ` +
    `${formData.bezel.top} ${formData.bezel.bottom} ${formData.bezel.left} ${formData.bezel.right}`;

  // set video-wall-decoder 0:1e:c0:f6:a6:ab mywall2 1 1 // col row
  for (let row = 0; row < formData.matrix.length; row++) {
    for (let col = 0; col < formData.matrix[row].length; col++) {
      cmd += '\n';
      cmd += `set video-wall-decoder ${formData.matrix[row][col]} ${name} ${row + 1} ${col + 1}`;
    }
  }

//  console.log('wall formDataToCmd', cmd);
  return cmd;
}

export function showEditor(show, item, index) {
//  console.log('wall showEditor', show);
  return {
    type: SHOW_EDITOR,
    show, // true = show, false = hide
    formData: itemToFormData(item, index)
  };
}

function makeCells(formData, row) {
  const cells = [];
  for (let col = 0; col < formData.columns; col++) {
    if (formData.matrix[row] && formData.matrix[row][col]) {
      cells.push(formData.matrix[row][col]);
    } else {
      cells.push('none');
    }
  }
  return cells;
}

function makeRows(formData) {
  const matrixRow = [];

  for (let row = 0; row < formData.rows; row++) {
    matrixRow.push(makeCells(formData, row));
  }
  return matrixRow;
}

export function formDataChanged(formData, dirty = true) {
//  console.log('formDataChanged before', formData);

  if (formData.rows > 5) {
    formData.rows = 5;
  }

  if (formData.columns > 5) {
    formData.columns = 5;
  }

  if (formData.bezel.top < 0) {
    formData.bezel.top = 0;
  }

  if (formData.bezel.right < 0) {
    formData.bezel.right = 0;
  }

  if (formData.bezel.bottom < 0) {
    formData.bezel.bottom = 0;
  }

  if (formData.bezel.left < 0) {
    formData.bezel.left = 0;
  }

  const matrix = makeRows(formData);

  let isDisplay = false;

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] !== 'none') {
        isDisplay = true;
        break;
      }
    }
    if (isDisplay) {
      break;
    }
  }

  let model = isDisplay ? formData.model : undefined;

  const newFormData = { ...formData, model, matrix, dirty };

//  console.log('formDataChanged', newFormData);

  return {
    type: FORM_DATA_CHANGED,
    formData: newFormData
  };
}

function requestItem() {
  return {
    type: REQUEST_ITEM
  };
}

/*

commands:set video-wall-encoder 0:1e:c0:f6:c2:f dc33

commands:create video-wall mywall2
set video-wall mywall2 2 2 0 0 0 0
set video-wall-decoder 0:1e:c0:f6:a6:ab mywall2 1 1 // col row
set video-wall-decoder 0:1e:c0:f6:a5:8e mywall2 1 2
set video-wall-decoder 0:1e:c0:f6:54:33 mywall2 2 1
set video-wall-decoder ff:0:0:0:22:14 mywall2 2 2
serverSocketName:rcServerSocket

commands:create video-wall mywall3
set video-wall mywall3 2 2 0 0 0 0
serverSocketName:rcServerSocket

2 col and 3 rows
commands:create video-wall mywall4
set video-wall mywall4 3 2 0 0 0 0
serverSocketName:rcServerSocket

req:
commands:create video-wall mywall4
set video-wall mywall4 2 3 0 1 2 3 // col, row, top, bot, left, right
serverSocketName:rcServerSocket

resp:
{"status":"Success","responses":[{"text":null,"errors":["Error1", "Error2"],"warnings":["Warning2","Warning2"]},{"text":null,"errors":["Error1","Error2"],"warnings":["Warning1","Warning2"]}]}

var inventory = [
    {name: 'apples', quantity: 2},
    {name: 'bananas', quantity: 0},
    {name: 'cherries', quantity: 5}
];

function findCherries(fruit) {
    return fruit.name === 'cherries';
}

console.log(inventory.find(findCherries)); // { name: 'cherries', quantity: 5 }

{
  "gen": {
    "name": "dc33",
    "videoSourceMac": "00:00:00:00:00:00",
    "numDisplayRows": "3",
    "numDisplayCols": "3"
  },
  "bezel": {
    "top": "0",
    "bottom": "0",
    "left": "0",
    "right": "0"
  },
  "decodersRow1": {
    "col1": "jag-dec2",
    "col2": "001EC0F67225",
    "col3": "jag-dec"
  },
  "decodersRow2": {
    "col1": "jag-dec-usb",
    "col2": "jag-dec-usb-mid",
    "col3": "ff:0:0:0:22:11"
  },
  "decodersRow3": {
    "col1": "ff:0:0:0:22:12",
    "col2": "ff:0:0:0:22:13",
    "col3": "none"
  }
}


commands:delete video-wall myNewWall
serverSocketName:rcServerSocket
*/

export function onRequestList(resolve, reject) {
//  console.log('wall onRequestList');
  return (dispatch, getState) => {
    const { fetching } = getState().wall;
    const { decoders } = getState().device;

    if (fetching) {
      dispatch(noop());
      if (resolve) {
        resolve(true);
      }
    } else {
      dispatch(requestList());
      try {
        fetchWalls()
          .then(resp => resp.json())
          .catch((err) => {
            appAlert.error(err);
          })
          .then(json => {
//            console.log('wall onRequestList response', json);

            if (json.status === 'Success') {
              const list = json.responses[0].text;

              dispatch(onAddModels(list, resolve, reject));
//              dispatch(receiveList(list));
//              dispatch(onGetModels(list));
            } else {
              const error = json.status;
              // console.log('fetchDevice error', error);
              dispatch(receiveError(error));
              if (reject) {
                reject(error);
              }
            }
          })
          .catch(error => {
            // console.log('fetchDevice error', error);
            dispatch(receiveError(error));
            if (reject) {
              reject(error);
            }
          })
          .then(() => {
            dispatch(showSpinner(false));
          });
      } catch (error) {
            // console.log('fetchDevice error', error);
          dispatch(receiveError(error));
          dispatch(showSpinner(false));
      }
    }
  };
}

export function onRequestListEx(withSpinner = true) {
  return (dispatch, getState) => {
    const { decoders, encoders, fetching } = getState().device;

//    console.log('onRequestListEx', decoders.status.info);
    return new Promise((resolve, reject) => {

      if (withSpinner) {
        dispatch(showSpinner());
      }

      if (fetching) {
  //      console.log('fetching');
        setTimeout(() => {
          dispatch(onRequestList(resolve, reject));
        }, 500);
      } else if (decoders.status.info && decoders.status.info.text && decoders.status.info.text.length > 0) {
          dispatch(onRequestList(resolve, reject));
      } else {
        // Request information on all devices, and process it.
        // Notice that this will cause a noticeable delay
        // on systems with a large number of devices.
        // Also, this solution only works for the one browser window which changes the wall.
        // Other browser windows and users will not get a timely update.
        dispatch(deviceActions.onRequestInfo())
          .then((deviceFetching) => {
            if (deviceFetching) {
  //            console.log('resolved fetching');
              setTimeout(() => {
                dispatch(onRequestList(resolve, reject));
              }, 500);
            } else {
  //            console.log('resolved not fetching');
              dispatch(onRequestList(resolve, reject));
            }
          })
          .catch((err) => {
//            console.log('catch rejected', err);
          })
          .then(() => {
            dispatch(showSpinner(false));
  //          console.log('cleanup');
          });
      }

    });
  };
}

export function onRequestUpdateWall() {
  return (dispatch, getState) => {
    const { formData } = getState().wall;
    dispatch(showSpinner());
    updateWall(formDataToCmd(formData))
      .then(resp => resp.json())
      .catch((err) => {
        appAlert.error(err);
      })
      .then(json => {
        if (json.status === 'Success') {
          const list = json.responses[0].text;
//          console.log('onRequestUpdateWall', JSON.stringify(json, 0, 2));
          let errorCount = 0;
          json.responses.forEach((resp) => {
            if (resp.errors && resp.errors.length !== 0) {
              errorCount++;
              appAlert.error(`${resp.errors.join(', ')}, failed to save video wall \'${formData.name}\'`);
            }
          });

          if (errorCount === 0) {
            appAlert.success(`Saved video wall ${formData.name}`);
          }

          dispatch(onRequestListEx());
          dispatch(showEditor(false));
        } else {
          const error = json.status;
          appAlert.error(`${error.toString()}, failed to save video wall ${formData.name}`);
          dispatch(receiveError(error));
        }
      })
      .catch(error => {
        appAlert.error(`${error.toString()}, failed to save video wall ${formData.name}`);
        dispatch(receiveError(error));
      })
      .then(() => {
        dispatch(showSpinner(false));
      });
  };
}

export function onRequestDeleteWall(name) {
  return (dispatch, getState) => {
    deleteWall(name)
      .then(resp => resp.json())
      .catch((err) => {
        appAlert.error(err);
      })
      .then(json => {
        // console.log('fetchDevice:', json);
        if (json.status === 'Success') {

          let err = false;

          json.responses.forEach((res) => {
            if (res.errors.length !== 0) {
              err = true;
              appAlert.error(res.errors.join(', '));
            }
          });

          if (!err) {
            appAlert.success(`Deleted video wall \"${name}\"`);
          }

          dispatch(onRequestListEx());
        } else {
          const error = json.status;
          appAlert.error(`${error.toString()}, failed deletinging video wall ${name}`);
          dispatch(receiveError(error));
        }
      })
      .catch(error => {
        appAlert.error(`${error.toString()}, failed deletinging video wall ${name}`);
        dispatch(receiveError(error));
      });
  };
}

export function onRequestJoinSrcToWall(SrcMac, wallName) {
  return (dispatch, getState) => {
    joinSrcToWall(SrcMac, wallName)
      .then(resp => resp.json())
      .catch((err) => {
        appAlert.error(err);
      })
      .then(json => {
        if (window.diag) {
//          console.log('joinSrcToWall', JSON.stringify(json, 0, 2));
        }

        let err = false;

        if (json.status === 'Success') {

          json.responses.forEach((res) => {
            if (res.errors.length !== 0) {
              err = true;
              appAlert.error(res.errors.join(', '));
            }
          });

          if (!err) {
            appAlert.success(`Joined source ${SrcMac} to video wall ${wallName}`);
          }

          dispatch(onRequestListEx(false));
        } else {
          const error = json.status;
          appAlert.error(`${error.toString()}, failed Joining source ${SrcMac} to video wall ${wallName}`);
          dispatch(receiveError(error));
        }
      })
      .catch(error => {
        appAlert.error(`${error.toString()}, failed Joining source ${SrcMac} to video wall ${wallName}`);
        dispatch(receiveError(error));
      });
  };
}
