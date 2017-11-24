/* eslint react/prop-types: 0 no-console: 0 */

import * as wallActions from '../wall/actions';
import { joinZone } from '../../service/apiFetch/join';

import { NOOP, REQUEST_LIST, RECEIVE_LIST, RECEIVE_LIST_OBJECT, REMOVE_LIST_OBJECT_ITEM,
  RECEIVE_LIST_AND_PATCH, RECEIVE_UNCOLLAPSED,
  RECEIVE_ERROR, RECEIVE_INFO, SHOW_EDITOR, FORM_DATA_CHANGED,
  REQUEST_ITEM,
  RECEIVE_DEEP_ITEM, SPINNER, ACTIVE_PAGE_CHANGED, 
  SELECT_ZONE, RECEIVE_BREADCRUMB, getNodeId, parentIdKey } from './constants';

import { fetchZones, saveZone, removeZone, removeItemFromZone, clearItemsFromZone,
  fetchDeepDisplaysAndWallsOfZone } from './fetch';

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

export function activePageChanged(pageNumber) {
  return {
    type: ACTIVE_PAGE_CHANGED,
    pageNumber
  };
}

function requestList() {
  return {
    type: REQUEST_LIST
  };
}

export function selectZone(zone) {
  return {
    type: SELECT_ZONE,
    zone
  };
}


function receiveBreadcrumb(breadcrumb) {
  return {
    type: RECEIVE_BREADCRUMB,
    breadcrumb
  };
}

function receiveUncollapsed(uncollapsed) {
  return {
    type: RECEIVE_UNCOLLAPSED,
    uncollapsed
  };
}

export function onReceiveUncollapsed(zone, uncollapse) {
  return (dispatch, getState) => {

//    console.log('onReceiveUncollapsed', zone.id, uncollapse);

    const { uncollapsed, listObject } = getState().zone;

    dispatch(receiveUncollapsed({ ...uncollapsed, [zone.id]: uncollapse }));

    if (uncollapse && zone[parentIdKey]) {
      dispatch(onReceiveUncollapsed(listObject[zone[parentIdKey]], uncollapse));
    }

  };
}

export function onCollapsAll() {
  return (dispatch, getState) => {
    dispatch(receiveUncollapsed({}));
  };
}

function receiveList(list) {
  return {
    type: RECEIVE_LIST,
    list
  };
}

export function onReceiveList() {
  return (dispatch, getState) => {

    const { selected, listObject } = getState().zone;

    const list = Object.keys(listObject).filter((key) => {
      return selected ? listObject[key][parentIdKey] === selected.id : !listObject[key][parentIdKey];
    }).map((key) => {
      return listObject[key];
    });

    dispatch(receiveList(list));
  };
}

function receiveListObject(listObject) {
  return {
    type: RECEIVE_LIST_OBJECT,
    listObject
  };
}

function removeListObjectItem(id) {
  return {
    type: REMOVE_LIST_OBJECT_ITEM,
    id
  };
}

function receiveDeepItem(deepItem) {
  return {
    type: RECEIVE_DEEP_ITEM,
    deepItem
  };
}

function receiveError(error) {

  if (typeof(error) === 'string') {
    appAlert.error('Receiving error string', error);
  } else if (error.message) {
    appAlert.error('Receiving error', error.message);    
  }

  return {
    type: RECEIVE_ERROR,
    error // string
  };
}

function receiveInfo(info) {

  appAlert.info(info);
  
  return {
    type: RECEIVE_INFO,
    info // string
  };
}

function requestItem() {
  return {
    type: REQUEST_ITEM
  };  
}

const defaultFormData = {
  name: '',
  parent_zone_id: null,
  displays: [],
  walls: [],
  dirty: false
};

function showEditorEx(show, item) {
//  console.log('showEditor', show, item);
  return {
    type: SHOW_EDITOR,
    show, // true = show, false = hide
    formData: item ? { dirty: false, id: item.id, name: item.name, parent_zone_id: item.parent_zone_id, 
      displays: item.display_macs ? item.display_macs.split(',') : [], 
      walls: item.wall_names ? item.wall_names.split(',') : [] } : { ...defaultFormData, displays: [], walls: [] },
    origFormData: item ? { id: item.id, name: item.name, parent_zone_id: item.parent_zone_id, 
      displays: item.display_macs ? item.display_macs.split(',') : [], 
      walls: item.wall_names ? item.wall_names.split(',') : [] } : undefined
  };
}

export function showEditor(show, item) {
  return (dispatch, getState) => {
    dispatch(showEditorEx(show, item));
  };
}

export function formDataChanged(formData) {
//  console.log('formDataChanged', formData);
  const newFormData = { ...formData, dirty: true };
//  console.log('formDataChanged', newFormData);
  return {
    type: FORM_DATA_CHANGED,
    formData: newFormData
  };
}

export function onRequestList(zone) {
  return async (dispatch, getState) => {
    const { fetching } = getState().zone;
        
    if (fetching) {
      dispatch(noop());
    } else {

      dispatch(requestList());

      try {
      
        const resp = await fetchZones(zone ? zone.id : undefined);
        const json = await resp.json();

        if (json.success === true) {

          const list = json.result;

          const list2 = list.map(async (item) => {
            const respc = await fetchZones(item.id);
            const jsonc = await respc.json();
            let listc = [];
            if (jsonc.success === true) {
              listc = jsonc.result;
            }
            return { ...item, list: listc };
          });

          const list3 = await Promise.all(list2);

          const listObject = list3.reduce((acc, cur, i) => {
              acc[cur.id] = cur;
              return acc;
            }, {});

          dispatch(receiveListObject(listObject));
          dispatch(onReceiveList());       
        } else {
          const error = json.status;
          dispatch(receiveError(error));
        }

      } catch (error) {
        dispatch(receiveError(error));
      }
      dispatch(showSpinner(false));
    }
  };
}

export function onRequestListEx(zoneEx, breadcrumbIndex, zoneId) {
  return (dispatch, getState) => {
    const { list, fetching } = getState().wall;
    
//    console.log('onRequestListEx', decoders.status.info);
    
      dispatch(showSpinner());

      if (fetching) {
  //      console.log('fetching');
        setTimeout(() => {
          dispatch(onRequestList(zoneEx, breadcrumbIndex, zoneId));
        }, 500);

      } else if (list && list.length > 0) {
          dispatch(onRequestList(zoneEx, breadcrumbIndex, zoneId));
      } else {
  //      console.log('onRequestListEx onRequestInfo', decoders.status.info);
        dispatch(wallActions.onRequestListEx())
          .then((wallFetching) => {
            if (wallFetching) {
  //            console.log('resolved fetching');
              setTimeout(() => {
                dispatch(onRequestList(zoneEx, breadcrumbIndex, zoneId));
              }, 500);
            } else {
  //            console.log('resolved not fetching');
              dispatch(onRequestList(zoneEx, breadcrumbIndex, zoneId));
            }
          })
          .catch((err) => {
  //          console.log('rejected');
          })
          .then(() => {
            dispatch(showSpinner(false));
  //          console.log('cleanup');          
          });       
      }

  };
}

export function onRequestSave() {
  return (dispatch, getState) => {
    const { origFormData, formData, listObject, selected } = getState().zone;

    let parentZone;

    if (formData.id) { // edit
      if (selected) {
        if (selected[parentIdKey]) {
          parentZone = listObject[selected[parentIdKey]];
        }                    
      } else {
        parentZone = selected;
      }
    } else { // create child
      parentZone = selected;
    }

    formData.parent_zone_id = parentZone ? parentZone.id : null;

    delete formData.dirty;

//    console.log('onRequestSave', formData.id, parentZone ? parentZone.id : parentZone);

    clearItemsFromZone(origFormData)
      .then(() => {
        saveZone(formData)
          .then(resp => resp.json())
          .then(json => {
//            console.log('saveZone:', json);
            if (json.success === true) {
              appAlert.success(`Saved zone ${formData.name}`);
//              dispatch(onRequestList(undefined, breadcrumb.length - 1));
              dispatch(showEditor(false));
              dispatch(onRequestList(parentZone));
              dispatch(onReceiveUncollapsed(parentZone, true));
            } else {
              const error = json.status;
              dispatch(receiveError(`${error}, failed to save zone ${formData.name}`));
            }
          })
          .catch(error => {
            dispatch(receiveError(error));
          });
      })
      .catch(error => {
        dispatch(receiveError(error));
      });

  };
}

export function onRequestSaveDisplayOrWall(displayMac, wallName) {
  return (dispatch, getState) => {
    const { selected } = getState().zone;
    const currentZone = selected;

    let formData = {
      id: currentZone.id,
      name: currentZone.name,
      parent_zone_id: currentZone.parent_zone_id,
      displays: currentZone.display_macs.split(','),
      walls: currentZone.wall_names.split(',')
    };

    if (displayMac) {
      formData.displays.push(displayMac);
    }

    if (wallName) {
      formData.walls.push(wallName);
    }

    saveZone(formData)
      .then(resp => resp.json())
      .then(json => {
//        console.log('saveZone:', json);
        if (json.success === true) {
//          const list = json.responses[0].text;
//          console.log('onRequestSave', breadcrumbIndex);
          if (displayMac) {
            appAlert.success(`Added display ${displayMac} to zone ${formData.name}`);
          }

          if (wallName) {
            appAlert.success(`Added video wall ${wallName} to zone ${formData.name}`);
          }

//          dispatch(onRequestList(undefined, breadcrumb.length - 1));
          dispatch(showEditor(false));
          dispatch(onRequestList(selected));
        } else {
          const error = json.status;
          dispatch(receiveError(error));
        }
      })
      .catch(error => {
        dispatch(receiveError(error.message));
      });    
  };
}

function removeZoneDeep(id) {
  // get list

  return new Promise((resolve, reject) => {

//    console.log('fetchZones', id);
    
    fetchZones(id)
    .then(resp => resp.json())
    .then(json => {

//      console.log('fetchZones resove', id, json);

      if (json.success === true) {

//        console.log('fetchZones success', id, json);

        const list = json.result;

        // process list

        if (list.length > 0) {

          const removeZonePromises = list.map((subZone) => {
//            console.log('removeZonePromises', subZone.id, subZone.name);
            return removeZoneDeep(subZone.id);
          });

          // wait for children
          Promise.all(removeZonePromises)
            .then((reults) => {
              // delete self return the promise for it.
              // we only get here if ALL promises fulfill
//              console.log('removeZone', id, reults);
              removeZone(id)
                .then(resp => resp.json())
                .catch((err) => {
                  appAlert.error('Remove zone error', err);    
                })
                .then(json => {
                  if (json.success === true) {
//                    console.log('removeZoneDeep resolve', id);
        //            dispatch(onRequestList(undefined, breadcrumb.length - 1));
                    resolve(json);
                  } else {
  //                  console.log('removeZoneDeep reject', id);
                    const err = json.status;
                    reject(err);
                  }
                })
                .catch(err => {
//                  console.log('removeZoneDeep catch reject', id);
                  reject(err);
                });
                
            })
            .catch((err) => {
              // Will catch failure of first failed promise
//              throw new Error(err); // same as rejection
//              console.log('removeZoneDeep fetchZone catch reject', id);
              reject(err);
            });
        } else {
  //        return Promise.resolve();
          // no children
//            console.log('removeZoneDeep resolve no children', id);
            removeZone(id)
              .then(resp => resp.json())
              .catch((err) => {
                appAlert.error('Remove zone deep', err);    
              })
              .then(json => {
                if (json.success === true) {
//                    console.log('removeZoneDeep resolve', id, json);
      //            dispatch(onRequestList(undefined, breadcrumb.length - 1));
//                  if (json.result) {
                    resolve(json);
/*                    
                  } else {
                    reject(`no zone deleted for id ${id}`);
                  }
*/                  
                } else {
//                  console.log('removeZoneDeep reject', id);
                  const err = json.status;
                  reject(err);
                }
              })
              .catch(err => {
//                  console.log('removeZoneDeep catch reject', id);
                reject(err);
              });
        }

      } else {
//        console.log('fetchZones error', id, json);
        const err = json.status;
//        throw new Error(err); // same as rejection
        reject(err);
      }
    })
    .catch(err => {
//      console.log('fetchZones', id, err);
      // throw new Error(err); // same as rejection
      reject(err);
    });    
  });
}


export function onRemoveItemFromZone(displayMac, wallName, zoneId) {
  return (dispatch, getState) => {
    const { selected } = getState().zone;
    removeItemFromZone(displayMac, wallName, zoneId)
      .then(resp => resp.json())
      .then(json => {
        if (json.success === true) {

          if (displayMac) {
            appAlert.success(`Removed display ${displayMac} from zone ${zoneId}`);
          }

          if (wallName) {
            appAlert.success(`Removed video wall ${wallName} from zone ${zoneId}`);
          }

//          const parentZone = breadcrumb[breadcrumb.length - 2];
          dispatch(onRequestList(selected));

        } else {
          const error = json.status;
          dispatch(receiveError(error));
        }
      })
      .catch(error => {
        dispatch(receiveError(error.message));
      });    
  };
}

function getDeviceModel(id, devices) {
  if (id) {
    let devStatus;
    if (devices && devices.status && devices.status.info 
      && devices.status.info.text && devices.status.info.text.length > 0) {
      devStatus = devices.status.info.text.find((status) => {
        return status.gen.mac === id;
      });
      if (devStatus && devStatus.gen && devStatus.gen.model) {
        // Substring of Zyper4K, ZyperUHD, or ZyperHD: start=5 to the end of the string.
        return devStatus.gen.model.substring(5);
      }
    }
  }

  return undefined;
}

function getWallModel(name, walls) {

  if (name) {

    let wall;

    if (walls && walls.length > 0) {
        wall = walls.find((item) => {

//          console.log('getWallModel find', name, item.gen.name);  
          return item.gen.name === name;
        });

//      console.log('getWallModel', name, wall.model);  

      if (wall && wall.model) {
        return wall.model;
      }
    }
  }

  return undefined;
}

export function onJoinSrc(item, zone) {
  return (dispatch, getState) => {

    const { decoders, encoders } = getState().device;
    const { list } = getState().wall;

    // console.log('joinTwoDevices() - item.item:', item.item);
    // this.animateEx(true, 2); // todo
    
    const sourceMac = item.sourceMac;

    fetchDeepDisplaysAndWallsOfZone(zone)
    .then((zone2x) => {

      // discover model of source
      const srcModel = getDeviceModel(sourceMac, encoders);
      // filter zone displays and walls for the source model

//      console.log('zone onJoinSrc srcModel', srcModel);

      const zone2 = { ...zone2x, name: zone.name,
        displayMacs: zone2x.displayMacs.filter((mac) => { 
          return srcModel === getDeviceModel(mac, decoders);
        }),
        wallNames: zone2x.wallNames.filter((name) => { 
          return srcModel === getWallModel(name, list);
        })
      };
      // console.log('zone onJoinSrc srcModel:', srcModel, 'list:', list, 'zone2x:', zone2x, 'zone2:', zone2);

      // Check if there are any displays or walls.
      if (zone2.displayMacs.length === 0 && zone2.wallNames.length === 0) {
        appAlert.error(`Failed to join source ${sourceMac} to zone ${zone2.name}. There are no displays or walls in the zone.`);
      } else {
        joinZone(sourceMac, zone2, item.item, /* analogAudioConnection */)

        .then(resp => resp.json())
        .catch((err) => {
          appAlert.error('Join zone error', err);    
        })
        .then(json => {

  //          console.log('joinZone', JSON.stringify(json, 0, 2));
          
          if (json.status === 'Success') {
            appAlert.success(`Joined source ${sourceMac} to zone ${zone2.name} with ${zone2.displayMacs.length} displays and ${zone2.wallNames.length} walls.`);
          } else {
            const error = json.status;
            appAlert.error(`${error}, failed to join source ${sourceMac} to zone ${zone2.name}`);
          }

        })
        .catch(error => {
  //          dispatch(receiveError(error));
          console.log('joinZone error', error);
          appAlert.error(`${error.toString()}, failed to join source ${sourceMac} to zone ${zone2.name}`);
        });
      }
    });
  };
}

export function onReceiveBreadcrumb(zone) {
  return (dispatch, getState) => {

    const { listObject } = getState().zone;
    const breadcrumb = [];

    if (zone && zone.id) {
      let id = zone.id;
      while (id) {
        const z = { ...listObject[id] }; 
        breadcrumb.unshift(z);
        id = z[parentIdKey];
      }
    }
      
    dispatch(receiveBreadcrumb(breadcrumb));
  };
}

export function onSelectZone(zone) {
  return (dispatch, getState) => {

    const { editorShowing, selected, listObject } = getState().zone;

    if (!editorShowing) {
//      if ((zone && !selected) || (zone && selected && zone.id !== selected.id)) {
        dispatch(onRequestList(zone));
        dispatch(onReceiveBreadcrumb(zone));
        dispatch(selectZone(zone));
/*      } else {
        dispatch(onRequestList(undefined));
        dispatch(onReceiveBreadcrumb(zone));
        dispatch(selectZone(undefined));
      }
*/
    }
  };
}

export function onRequestRemove(id, name) {
  return (dispatch, getState) => {
    const { selected, listObject } = getState().zone;
    
    const zone = { ...listObject[id] };
    
//    console.log('onRequestRemove zone', zone);

    removeZoneDeep(id)
      .then((json) => {

        if (!json.result) {
          dispatch(receiveInfo(`No zone removed for id ${id} of ${name}`));
        } else {
          appAlert.success(`Zone ${name} removed`);
        }

//        dispatch(onRequestList(undefined, breadcrumb.length - 1));
          dispatch(removeListObjectItem(id));
          const parentIdKey = 'parent_zone_id';
          dispatch(onRequestList(selected));
          dispatch(onSelectZone(listObject[zone[parentIdKey]]));
          dispatch(onReceiveUncollapsed(listObject[zone[parentIdKey]], true));
        })
      .catch((err) => {
        dispatch(receiveError(err));
      });

  };
}
