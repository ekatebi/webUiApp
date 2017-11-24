
import CryptoJS from 'crypto-js';
import { fetchSec, saveSec, deleteSec, updatePw } from './fetch';

import {
    defaultUser,
    defaultRole,
    defaultPerm,
    SEC,
    REQUEST_LIST,
    RECEIVE_LIST,
    RECEIVE_ITEM,
    REQUEST_TOKEN,
    RECEIVE_TOKEN,
    RECEIVE_ERROR,
    ITEM_CHANGED,
    PW_CHANGED,
    PWV_CHANGED,
    SHOW_EDITOR,
    SELECT_TAB_INDEX,
    GUID,
    getSecTypeName
  } from './constants';

import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS
  } from '../appMenu/constants';

import * as authActions from '../auth/actions';
import * as filterActions from '../filter/actions';

export const encrypt = (param) => {
  return CryptoJS.AES.encrypt(param, GUID).toString();
};

export const decrypt = (param) => {
  return CryptoJS.AES.decrypt(param, GUID).toString(CryptoJS.enc.Utf8);
};

export function selectTabIndex(secType, index) {
  return {
    type: SELECT_TAB_INDEX,
    secType,
    index
  };
}

// authentication
function requestToken() {
  return {
    type: REQUEST_TOKEN
  };
}

function receiveToken(jwt, roles) {
  return {
    type: RECEIVE_TOKEN,
    jwt,
    roles
  };
}
// authentication end

function requestList(secType) {
  return {
    type: REQUEST_LIST,
    secType
  };
}

function receiveList(secType, list) {
  return {
    type: RECEIVE_LIST,
    secType,
    list
  };
}

function receiveItem(secType, data) {
  return {
    type: RECEIVE_ITEM,
    secType,
    data
  };
}

function receiveError(secType, error) {
  return {
    type: RECEIVE_ERROR,
    secType,
    error
  };
}

export function itemChanged(secType, data, show = true) {
  return {
    type: ITEM_CHANGED,
    secType,
    data,
    show
  };
}

export function pwChanged(secType, pw) {
  return {
    type: PW_CHANGED,
    secType,
    pw
  };
}

export function pwvChanged(secType, pwv) {
  return {
    type: PWV_CHANGED,
    secType,
    pwv
  };
}

export function onClearPwFields() {
  return (dispatch, getState) => {
    dispatch(pwChanged(MENU_ITEM_SEC_USERS));
    dispatch(pwvChanged(MENU_ITEM_SEC_USERS));
  };
}

export function onPwChanged(secType, data, pw, show = true) {
  return (dispatch, getState) => {
      dispatch(pwChanged(secType, pw));
      dispatch(itemChanged(secType, { ...data, pw: encrypt(pw) }, show));      
  };
}

export function onPwvChanged(secType, data, pwv, show = true) {
  return (dispatch, getState) => {
      dispatch(pwvChanged(secType, pwv));
      dispatch(itemChanged(secType, { ...data, pwv: encrypt(pwv) }, show));
  };
}

function defaultSec(secType) {
  switch (secType) {
    case MENU_ITEM_SEC_USERS:
      return defaultUser();
    case MENU_ITEM_SEC_ROLES:
      return defaultRole();
    default:
      return undefined;
  }  
}

export function showEditor(secType, show, data) {
  return {
    type: SHOW_EDITOR,
    secType,
    show,
    data: data || defaultSec(secType)
  };
}

export function onShowEditor(secType, show, data) {
  return (dispatch, getState) => {
    dispatch(filterActions.showFilter(secType));
    if (secType === MENU_ITEM_SEC_USERS) {
      dispatch(showEditor(secType, show, data));
      dispatch(pwChanged(secType, data && data.pw ? decrypt(data.pw) : undefined));
      dispatch(pwvChanged(secType, data && data.pw ? decrypt(data.pw) : undefined));
    } else if (secType === MENU_ITEM_SEC_ROLES) {
      dispatch(showEditor(secType, show, data));
    }
  };
}

function object2Array(obj) {
  if (obj) {

    const arr = Object.keys(obj).map((key) => {
      return { ...obj[key], id: key };
    });

    return arr;
  }
  
  return [];  
}

export const mapPermsFromDb = (perms) => {
  return perms.map((perm) => {  
      return { 
        name: perm.name,
        id: perm.id,
        role_id: perm.role_id,
        Display: typeof(perm.display) === 'number' ? perm.display > 0 : undefined,
        Configure: typeof(perm.config) === 'number' ? perm.config > 0 : undefined,
        Admin: typeof(perm.admin) === 'number' ? perm.admin > 0 : undefined
      };
    });
};

/*
const mapRolesFromDb = (roles) => {
  return roles.map((role) => {
      return { ...role, perms: mapPermsFromDb(role.perms),
          userIds: !window.native ? role.userIds :
            role.users.map((user) => { return user.id; }) };
      });
};
*/

const mapRolesFromDb = (roles) => {
  return roles.map((role) => {
      return { ...role, perms: mapPermsFromDb(role.perms) };
      });
};

export const mapUsersFromDb = (users) => {
    return users.map((user) => {  
      return { ...user, forcePwChange: user.forcePwChange > 0 };
    });
};

export const onRequestList = (secType, item) => {
  return async (dispatch, getState) => {
    try {

      const { tokenRaw } = getState().auth;

      dispatch(requestList(secType));
      const resp = await fetchSec(secType, tokenRaw, item);
      const json = await resp.json();
      if (item) {
        let itm = json;
        if (secType === MENU_ITEM_SEC_ROLES) {
          itm = { ...itm, perms: await mapPermsFromDb(itm.perms) };
        }
        dispatch(receiveItem(secType, itm));
      } else {
        let items = [];          
        items = window.native ? json.data : object2Array(json);

//        console.log('items before mapFromDb', secType, items);
        
        if (secType === MENU_ITEM_SEC_ROLES) {
          items = mapRolesFromDb(items);
        } else if (secType === MENU_ITEM_SEC_USERS) {
          items = mapUsersFromDb(items);
        }

//        console.log('items after mapFromDb', secType, items);

        dispatch(receiveList(secType, items));
      }
    } catch (err) {
      appAlert.error(err);          
    }
  };
};

const mapPermsToDb = (perms) => {
  return perms.map((perm) => {

      const perm2 = {
        name: perm.name
      };

      if (perm.id) {
        perm2.id = perm.id;
      }

      if (perm.role_id) {
        perm2.role_id = perm.role_id;
      }

      if (perm.Admin !== undefined && typeof(perm.Admin) === 'boolean') {
        perm2.admin = perm.Admin === true ? 1 : 0;         
      }

      if (perm.Configure !== undefined && typeof(perm.Configure) === 'boolean') {
        perm2.config = perm.Configure === true ? 1 : 0;         
      }

      if (perm.Display !== undefined && typeof(perm.Display) === 'boolean') {
        perm2.display = perm.Display === true ? 1 : 0;         
      }

      return perm2;
    });
};

export const onUpdatePw = (itm) => {
  return async (dispatch, getState) => {

    try {

      const { tokenRaw } = getState().auth;

      let item = { ...itm };

      const resp = await updatePw(tokenRaw, item);

      const json = await resp.json();

      if (json.error === true && json.data.message) {
        dispatch(authActions.receiveError(json.data.message));
      } else if (json.data.message) {
        dispatch(authActions.receiveInfo(json.data.message));
//        dispatch(authActions.receiveInfo(`password successfully updated for user: ${item.name}`));
      }
    } catch (err) {
      dispatch(authActions.receiveError(err.toString()));
    } 
  };
};

export const onSave = (secType, itm) => {
  return async (dispatch, getState) => {

    try {

      const { tokenRaw } = getState().auth;

      let item = { ...itm };

      if (secType === MENU_ITEM_SEC_ROLES) {
        item = { ...item, perms: await mapPermsToDb(item.perms) };
      }

      const resp = await saveSec(secType, tokenRaw, item);

      const json = await resp.json();

      dispatch(showEditor(secType, false));
      dispatch(onRequestList(secType));

      if (secType === MENU_ITEM_SEC_ROLES) {
        dispatch(onRequestList(MENU_ITEM_SEC_USERS));        
      } else if (secType === MENU_ITEM_SEC_USERS) {
        dispatch(onRequestList(MENU_ITEM_SEC_ROLES));        
      }

      if (json.error) {
        appAlert.error(json.data.message);    
      } else {
        appAlert.info(`saved ${getSecTypeName(secType)} ${item.name}`);
      }
    } catch (err) {
//      console.error('saveSec error', err.toString());
      appAlert.error(err);    
      // dispatch(receiveError(secType, error));
    } 
  };
};

export const onDelete = (secType, item) => {
  return async (dispatch, getState) => {

    try {

      const { tokenRaw } = getState().auth;

      const resp = await deleteSec(secType, tokenRaw, item);
      const json = await resp.json();

      dispatch(onRequestList(secType));

      if (secType === MENU_ITEM_SEC_ROLES) {
        dispatch(showEditor(MENU_ITEM_SEC_USERS, false));
        dispatch(onRequestList(MENU_ITEM_SEC_USERS));        
      } else if (secType === MENU_ITEM_SEC_USERS) {
        dispatch(showEditor(MENU_ITEM_SEC_ROLES, false));
        dispatch(onRequestList(MENU_ITEM_SEC_ROLES));        
      }

//      appAlert.info(`deleted ${JSON.stringify(item)}`);
//      console.log('onDelete', json);

      appAlert.info(`deleted ${getSecTypeName(secType)} ${item.name}`);

    } catch (err) {
      appAlert.error(err);    
      // dispatch(receiveError(secType, error));
    }
  };
};

