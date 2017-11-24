
import {
  URL_DB as strUrl,
  secDb,
  secDbNative,
  secDbNatives,
} from '../../constant/app';

import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_USERS_PW,
  MENU_ITEM_SEC_ROLES,
  MENU_ITEM_SEC_PERMS,
  MENU_ITEM_SEC_AUTH,
  } from '../appMenu/constants';

const headers = (token) => {
  return token ? {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  } :
  {
    'Content-Type': 'application/json'
  };
};

function restUrl(secType, item) {
//  const secDbNativeUrl = secType === MENU_ITEM_SEC_AUTH ? secDbNatives : secDbNative;
  const secDbNativeUrl = secDbNative;
  let url = window.native ? secDbNativeUrl : secDb;
  switch (secType) {
    case MENU_ITEM_SEC_AUTH:
      url += '/auth';
      break;
    case MENU_ITEM_SEC_ROLES:
      url += '/roles';
      break;
    case MENU_ITEM_SEC_USERS:
      url += '/users';
      break;
    case MENU_ITEM_SEC_USERS_PW:
      url += '/users/pw';
      break;
    case MENU_ITEM_SEC_PERMS:
      url += '/perms';
      break;
    default:
      url += '/default';    
      break;
   }   

   url += item && item.id ? `/${item.id}` : '';
   url += window.native ? '' : '.json';

//   console.log('restUrl', url);

   return url;
}

export const auth = (userId, pw) => {
  const options = {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify({ userId, pw })
  };

  const url = new URL(restUrl(MENU_ITEM_SEC_AUTH));

  return fetch(url, options);
};

export const selectRole = (roleId, token) => {
  const options = {
    method: 'GET',
    headers: headers(token)
  };  

  const url = new URL(restUrl(MENU_ITEM_SEC_AUTH, { id: roleId }));

  return fetch(url, options);
};

const fetchSecDev = (secType, item) => {

  const options = {
      headers: new Headers({
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      method: 'GET'
    };

  const url = new URL(restUrl(secType, item));

  return fetch(url, options);
};

const fetchSecProd = (secType, token, item) => {

  const options = { method: 'GET', 
    headers: headers(token)
  };

  const url = new URL(restUrl(secType, item));

  return fetch(url, options);
};

export const fetchSec = (secType, token, item) => {
  return window.native ?
    fetchSecProd(secType, token, item)
    : 
    fetchSecDev(secType, item);
};

function removeExtraProps(item) {
  const itm = { ...item };
  delete itm.secType;
  delete itm.id;
  delete itm.index;  
  return itm; 
}

export function saveSecDev(secType, item) {

  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/json'
    }),
    method: item.id ? 'PUT' : 'POST',
    body: JSON.stringify(removeExtraProps(item))
  };

  const url = new URL(restUrl(secType, item));

  return fetch(url, options);
}

const saveSecProd = (secType, token, item) => {

  const options = {
    headers: headers(token),
    method: item.id ? 'PUT' : 'POST',
    body: JSON.stringify(removeExtraProps(item))
  };

  const url = new URL(restUrl(secType, item));

  return fetch(url, options);
};

export function updatePwDev(item) {

//  const item = { id: itm.id, pw: itm.pw };
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/json'
    }),
    method: 'PUT',
    body: JSON.stringify(item)
  };

  const url = new URL(restUrl(MENU_ITEM_SEC_USERS_PW, item));

  return fetch(url, options);
}

const updatePwProd = (token, itm) => {

  const item = { id: itm.id, pw: itm.pw };

  const options = {
    headers: headers(token),
    method: 'PUT',
    body: JSON.stringify(item)
  };

  const url = new URL(restUrl(MENU_ITEM_SEC_USERS_PW, item));

  return fetch(url, options);
};

export const updatePw = (token, item) => {
  return window.native ?
    updatePwProd(token, item)
    : 
    updatePwDev(item);
};

export function saveSec(secType, token, item) {
  return window.native ?
    saveSecProd(secType, token, item)
    : 
    saveSecDev(secType, item);
}

const deleteSecDev = (secType, item) => {

  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/json'
    }),
    method: 'DELETE'
  };

  const url = new URL(restUrl(secType, item));

  return fetch(url, options);
};

const deleteSecProd = (secType, token, item) => {

  const options = {
    headers: headers(token),
    method: 'DELETE'
  };

  const url = new URL(restUrl(secType, item));

  return fetch(url, options);
};

export function deleteSec(secType, token, item) {
  return window.native ?
    deleteSecProd(secType, token, item)
    : 
    deleteSecDev(secType, item);
}

export const redirectForCertApproval = () => {
  const url = `${restUrl(MENU_ITEM_SEC_AUTH)}/cert`;
  window.open(url, '_blank');
};
