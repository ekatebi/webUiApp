import expect from 'expect';
import * as actions from '../../src/action/auth';
import * as types from '../../src/constant/auth';
import { signInTokenKey, serverHost } from '../../src/constant/app';
import fetchMock from 'fetch-mock';
import mockStore from '../mockStore';


describe('Actions', () => {

  describe('auth', () => {
    
    beforeEach(() => localStorage.clear());
    afterEach(() => fetchMock.restore());
    
    it('should create signIn action', () => {
      expect(actions.onSignIn()).toEqual({ type: types.SIGNIN });
    });

    it('should create hide modal action', () => {
      expect(actions.onHideModal()).toEqual({ type: types.HIDE_MODAL });
    });

    it('should create signOut action and remove token from localStorage', () => {
      localStorage.setItem(signInTokenKey, 'test token');
      expect(actions.onSignOut()).toEqual({ type: types.SIGNOUT });
      const token = localStorage.getItem(signInTokenKey);
      expect(token).toEqual(null);
    });

    it('should create action RECEIVE_TOKEN with token', (done) => {
      const token = 'test token';
      localStorage.setItem(signInTokenKey, token);
      const expectedActions = [{ type: types.RECEIVE_TOKEN }];
      const store = mockStore(undefined, expectedActions, done);
      store.dispatch(actions.onReadToken());
    });

    it('should create no action', (done) => {
      const expectedActions = [];
      const store = mockStore(undefined, expectedActions);
      store.dispatch(actions.onReadToken());
      done();
    });

    it('should create RECEIVE_TOKEN action', (done) => {
      const token = 'some token';
      const expectedActions = [
        { type: types.REQUEST_TOKEN },
        { type: types.RECEIVE_TOKEN }
      ];
      const state = { auth: { fetching: false, showModal: true, error: '', token: false } };
      const authUrl = `${serverHost}/token`;
      fetchMock.mock(authUrl, 'post', { token });
      const store = mockStore(state, expectedActions, done);
      store.dispatch(actions.onRequestToken());
    });

    it('should ignore request token', (done) => {
      const expectedActions = [{ type: types.NOOP }];
      const state = { auth: { fetching: true, showModal: false, error: '', token: false } };
      const store = mockStore(state, expectedActions, done);
      store.dispatch(actions.onRequestToken());
    });

  });
});
