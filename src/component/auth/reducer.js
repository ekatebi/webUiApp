import { RECEIVE_ERROR, RECEIVE_INFO, SIGNOUT, LOGIN, USER_PW_CHANGE } from './constants';

const initState = {
  info: undefined,
  error: undefined,
  token: undefined,
  tokenRaw: undefined,
  pwChange: false
};

export default function auth(state = initState, action) {
  switch (action.type) {
    case RECEIVE_INFO:
      return { ...state, info: action.info };
    case RECEIVE_ERROR:
      return { ...state, error: action.error, info: undefined, token: undefined, pwChange: false };
    case SIGNOUT:
      return { ...state, token: undefined, tokenRaw: undefined, 
        error: undefined, info: undefined, pwChange: false };
    case LOGIN:
      return { ...state, token: { ...action.token }, tokenRaw: action.token.tokenRaw, 
      error: undefined, info: undefined };
    case USER_PW_CHANGE:
      return { ...state, pwChange: action.pwChange };
    default:
      return state;
  }
}
