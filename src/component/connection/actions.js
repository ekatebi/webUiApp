/* eslint no-use-before-define: [1, 'nofunc'] */

import { defaultModels } from './connectionDefaults';
import { fetchConn, saveConn, removeConn } from './fetch';
import {
  DEFAULT_CONNECTION_CHANGED,
  CONNECTION_FORM_CHANGED,
  CONNECTION_LIST_INIT,
  CONNECTION_LIST_CHANGED,
  CONNECTION_VERSION,
} from './constants';

import { StorageTypes } from '../../constant/storageTypes';
import { ObjectStorage } from '../../service/storage';

const storage = new ObjectStorage(localStorage, StorageTypes.Connection);

export function defaultConnectionChanged(model, index) {
  return {
    type: DEFAULT_CONNECTION_CHANGED,
    model,
    index
  };
}

export function connectionFormDataChanged(model, formData) {
  return {
    type: CONNECTION_FORM_CHANGED,
    model,
    formData
  };
}

export function connectionListChanged(model, list) {
  return {
    type: CONNECTION_LIST_CHANGED,
    model,
    list
  };
}

// Initialize state with join configurations of all models.
export function connectionListInit(joinConfigVersions) {
  return {
    type: CONNECTION_LIST_INIT,
    joinConfigVersions
  };
}

function restoreFromFactoryDefaults() {
  return (dispatch, getState) => {
    let localStorageConn = storage.get();

    if (localStorageConn) {
      // If the stored configuration is from an early release, 1.2,
      // it has a list of Zyper4K join configurations
      // so it will not have model Zyper4K on the top level.
      if (!localStorageConn.Zyper4K) {
        // Move the existing list to model Zyper4K list,
        // and add all the initial join configurations.
        localStorageConn = {
          Zyper4K: {
            defaultIndex: 0,
            list: defaultModels.Zyper4K.list.concat(localStorageConn.list),
          },
          ZyperUHD: {
            defaultIndex: 0,
            list: defaultModels.ZyperUHD.list,
          },
          ZyperHD: {
            defaultIndex: 0,
            list: defaultModels.ZyperHD.list,
          },
          list: undefined
        };
        dispatch(connectionListInit(localStorageConn));
        storage.remove();
        dispatch(onSave());
        appAlert.info('Connection settings imported from 1.2 version of browser local storage');
      } else {
        dispatch(connectionListInit(localStorageConn));
        storage.remove();
        dispatch(onSave());
        appAlert.info('Connection settings imported from 1.3 version of user local storage');
      }
    } else {
      // If there are no join configurations from the browser's local storage,
      // use the factory default join configurations.
      dispatch(connectionListInit({ [CONNECTION_VERSION]: { models: defaultModels } }));
      dispatch(onSave());
      appAlert.info('Connection settings restored from factory defaults');
    }
  };
}


// Get join configurations.
export function onLoad() {
//  console.log('onLoad');
  return (dispatch, getState) => {
    // Get join configurations from storage file.
    fetchConn()
      .then(resp => resp.json())
      .catch((error) => {
        appAlert.error('Connection settings', error);
      })
      .then(json => {
        if (json.error && json.error === 'store not found') {
          // If there are no join configurations from the storage file,
          // get join configurations from the browser's local storage.
          dispatch(restoreFromFactoryDefaults());
        } else if (json.error) {
          appAlert.error('Connection settings JSON error', json.error);
        } else {
          // Process join configurations from the storage file.
          if (!json.joinConfigVersions) {
            // If it's from the storage file, but doesn't have versions on the top level, it's version 1.5.
            // Add UHD to go from 1.5 to 1.6.
            dispatch(connectionListInit({ [CONNECTION_VERSION]: { models: { ...json, ZyperUHD: { ...defaultModels.ZyperUHD } } } }));
            dispatch(onSave());
          } else {
            dispatch(connectionListInit(json.joinConfigVersions));
          }
        }
      })
      .catch((error) => {
        appAlert.error('Connection settings JSON function', error);
      });
  };
}

export function onSave() {
//  console.log('onSave');
  return (dispatch, getState) => {
    const joinConfigVersions = getState().joinConfigVersions;
    // Remove formData.
    delete joinConfigVersions[CONNECTION_VERSION].models.formData;
    saveConn({ joinConfigVersions })
      .then(resp => resp.json())
      .then(json => {
        if (json.error) {
          appAlert.error('Connection settings save JSON error', json.error);
        } else {
          dispatch(onLoad());
        }
      })
      .catch((error) => {
        appAlert.error('Connection settings, save. Unable to parse repsonse to JSON', error);
      });
  };
}

export function onRestoreFactoryDefaults() {
  return (dispatch, getState) => {
    dispatch(restoreFromFactoryDefaults());
  };
}

export function onDefaultConnectionChanged(model, index) {
  return (dispatch, getState) => {
    dispatch(defaultConnectionChanged(model, index));
    dispatch(onSave());
  };

}
