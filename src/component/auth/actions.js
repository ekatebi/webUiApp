import jwt from 'jsonwebtoken';
import { signInTokenKey, serverHost } from '../../constant/app';
import authOptions from '../../service/auth';
import { SIGNIN, REQUEST_TOKEN, RECEIVE_TOKEN, NOOP, USER_PW_CHANGE,
  RECEIVE_ERROR, RECEIVE_INFO, SIGNOUT, HIDE_MODAL, LOGIN, ADD_ROLES_TO_TOKEN } from './constants';
import {
  MENU_ITEM_SEC_USERS,
  MENU_ITEM_SEC_ROLES
  } from '../appMenu/constants';
import * as secActions from '../security/actions';
import * as secFetch from '../security/fetch';
import { getAdminRole, getPermsObject } from '../security/constants';

function makeToken(user, pw) {
  if (user === 'admin' && pw === 'admin') {
    return Math.random().toString(36).substring(7);
  }
  return undefined;
}

function makeTokenEx(userId, pw, users) {

  if (userId.toLowerCase() === 'admin' && pw.toLowerCase() === 'admin') {
//    return Math.random().toString(36).substring(7);
//    console.log('getAdminRole', getAdminRole());
    return { name: 'admin', userId, role: getAdminRole() };
  }

  if (window.sec) {
    const user = users.find((u) => {
      return u.userId === userId;
    });

    if (user) {
      if (secActions.decrypt(user.pw) === pw) {
        return { ...user };
      }

      if (window.diag) {
        console.log(secActions.decrypt(user.pw));
      }
    } else if (window.diag) {
      console.log(`user not found, ${user}, (${users.length})`);
    }
  }

  return undefined;
}

export function login(token) {
  return {
    type: LOGIN,
    token
  };
}

export function userPwChange(pwChange = true) {
  return {
    type: USER_PW_CHANGE,
    pwChange
  };
}

function noop() {
  return {
    type: NOOP,
  };
}

function requestToken() {
  return {
    type: REQUEST_TOKEN,
  };
}

export function receiveError(error) {
  return {
    type: RECEIVE_ERROR,
    error,
  };
}

export function receiveInfo(info) {
  return {
    type: RECEIVE_INFO,
    info,
  };
}

function receiveToken() {
  return {
    type: RECEIVE_TOKEN,
  };
}

export const onSelectRoleDev = (index) => {
  return (dispatch, getState) => {

    const { token } = getState().auth;

    const role = { ...token.roles[index] };

    if (role.perms) {
      const perms = [...role.perms];
      role.perms = getPermsObject(perms);
      delete token.roles;

      dispatch(login({ ...token, role }));
    } else {
      dispatch(receiveError('no perms in role'));
    }
  };
};

export const onLoginDev = (userId, pw) => {
  return (dispatch, getState) => {    
    
    const { [MENU_ITEM_SEC_USERS]: usersState } = getState().sec;
    const users = usersState.list;
    const token = makeTokenEx(userId, pw, users);

    if (token) {
      dispatch(login({ ...token }));
    } else {
      dispatch(receiveError('Incorrect user id or password'));
    }
    
  };
};

export const onProcessSelectRoleTokenProd = (tokenRaw) => {
  return async (dispatch, getState) => {
    const token = jwt.decode(tokenRaw);
    const role = { ...token.selectedRole };
    role.perms = secActions.mapPermsFromDb(role.perms).reduce((acc, cur, i) => {
      acc[cur.name] = { ...cur };              
      return acc;
    }, {});
    token.role = { ...role };
    delete token.selectedRole;
    delete token.roles;
    dispatch(login({ ...token, tokenRaw }));
  };
};

export const onSelectRoleProd = (roleIndex, tknArg) => {
  return async (dispatch, getState) => {

    try {
      const { token: tknState } = getState().auth;
      const tkn = tknArg || tknState;
      const resp = await secFetch.selectRole(tkn.roles[roleIndex].id, tkn.tokenRaw);
      const json = await resp.json();

      if (json.error) {
        dispatch(receiveError(json.data.message));        
      } else {
        dispatch(onProcessSelectRoleTokenProd(json.data.token));
      }
    } catch (err) {
      dispatch(receiveError(err.toString()));              
//      dispatch(receiveError(`onSelectRoleProd ${err.toString()}`));              
    }
  };
};

export const onSelectRole = (roleIndex) => {
  return async (dispatch, getState) => {
    return window.native ? dispatch(onSelectRoleProd(roleIndex)) : dispatch(onSelectRoleDev(roleIndex));
  };
};

export const onLoginProd = (userId, pw) => {
  return async (dispatch, getState) => {    

    try {

      // clear error and info
      dispatch(receiveError());
      dispatch(receiveInfo());

      const resp = await secFetch.auth(userId, pw);
      const json = await resp.json();

      if (json.error) {
        dispatch(receiveError(json.data.message));        
      } else {
        const tokenRaw = json.data.token;
        const token = jwt.decode(tokenRaw);
        if (token.selectedRole) {
          dispatch(onProcessSelectRoleTokenProd(tokenRaw));
        } else if (token.roles) {
          dispatch(login({ ...token, tokenRaw }));          
        }

      }
    } catch (err) {      
      dispatch(receiveError(err.toString()));
//      dispatch(receiveError(`onLoginProd ${err.toString()}`));              
    }    
  };
};

export const onLogin = (userId, pw) => {
  return window.native ? onLoginProd(userId, pw) : onLoginDev(userId, pw);
};

function signOut() {
  return {
    type: SIGNOUT,
  };
}

export function onGetUserRoles() {
  return (dispatch, getState) => {

    const { token } = getState().auth;

    if (token) {
      const { [MENU_ITEM_SEC_ROLES]: rolesState } = getState().sec;
      const rolesList = rolesState.list || [];
      const userRoles = [];

      rolesList.forEach((role) => {

        let index = -1;

        if (role.userIds) {
          index = role.userIds.findIndex((id) => {
            return id === token.id;
          });
        }

        if (index > -1) {
          userRoles.push(role);
        }

      });

      if (userRoles.length === 0) {
        dispatch(receiveError(`User, ${token.name}, is not a member of any role.`));
      } else if (userRoles.length === 1) {
        const role = { ...userRoles[0] };
        const perms = [...role.perms];
        role.perms = getPermsObject(perms);
        dispatch(login({ ...token, role }));
      } else {
        dispatch(login({ ...token, roles: [...userRoles] }));
      }

    }
  };
}

const onCert = () => {
  return async (dispatch, getState) => {    

    try {

      secFetch.redirectForCertApproval();

    } catch (err) {      
      dispatch(receiveError(err.toString()));
    }    
  };
};

export function onSignOut() {
  return (dispatch, getState) => {

    const { error } = getState().auth;

    if (error && error.startsWith('TypeError: Network request failed')) {
      dispatch(receiveError());
      dispatch(receiveInfo());
      dispatch(onCert());  
    } else {
      dispatch(signOut());
    }
  };
}
