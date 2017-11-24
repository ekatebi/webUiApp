import expect from 'expect';
import auth from '../../src/reducer/auth';
import { SIGNIN, REQUEST_TOKEN, RECEIVE_TOKEN,
 RECEIVE_ERROR, SIGNOUT, HIDE_MODAL } from '../../src/constant/auth';

describe('Reducers', () => {

  describe('auth', () => {

    it('should handle initial state', () => {
      const initState = { fetching: false, showModal: false, error: '', token: false };
      const state = auth(undefined, {});
      expect(state).toEqual(initState);
    });

    it('should handle SIGNIN action type', () => {
      const state = { fetching: false, showModal: false, error: '', token: false };
      const newState = auth(state, { type: SIGNIN });
      const exp = Object.assign({}, state, { showModal: true });
      expect(newState).toEqual(exp);
    });

    it('should handle REQUEST_TOKEN action type', () => {
      const state = { fetching: false, showModal: true, error: '', token: false };
      const action = { type: REQUEST_TOKEN };
      const exp = Object.assign({}, state, { fetching: true, showModal: true, error: '' });
      const newState = auth(state, action);
      expect(newState).toEqual(exp);
    });

    it('should handle RECEIVE_TOKEN action type', () => {
      const state = { fetching: true, showModal: false, error: '', token: false };
      const action = { type: RECEIVE_TOKEN, token: true };
      const exp = Object.assign({}, state, { fetching: false,
        showModal: false, token: action.token });
      const newState = auth(state, action);
      expect(newState).toEqual(exp);
    });


    it('should handle RECEIVE_ERROR action type', () => {
      const state = { fetching: true, showModal: false, error: '', token: false };
      const action = { type: RECEIVE_ERROR, error: 'error' };
      const exp = Object.assign({}, state, { fetching: false,
        showModal: true, error: action.error });
      const newState = auth(state, action);
      expect(newState).toEqual(exp);
    });

    it('should handle SIGNOUT action type', () => {
      const action = { type: SIGNOUT };
      const initState = { fetching: false, showModal: false, error: '', token: true };
      const exp = Object.assign({}, initState, { token: false });
      const newState = auth(initState, action);
      expect(newState).toEqual(exp);
    });

    it('should handle HIDE_MODAL action type', () => {
      const state = { fetching: false, showModal: true, error: '', token: false };
      const action = { type: HIDE_MODAL, showModal: false };
      const exp = Object.assign({}, state, { showModal: false });
      const newState = auth(state, action);
      expect(newState).toEqual(exp);
    });

    it('should handle undefined action type', () => {
      const action = {};
      const state = { fetching: false, showModal: true, error: '', token: false };
      const newState = auth(state, action);
      expect(newState).toEqual(state);
    });
  });
});
