import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import Auth from '../../src/container/Auth';
import shallowRender from '../helpers';
import { Modal } from 'react-bootstrap';
import configureStore from '../../src/store/configureStore';

function setup(initialState) {
  const store = configureStore(initialState);
  const app = TestUtils.renderIntoDocument(
    <Provider store={store}>
      <Auth />
    </Provider>
    );
  return {
    app,
    store,
    loginButton: TestUtils.findRenderedDOMComponentWithClass(app, 'loginButton'),
    modals: TestUtils.scryRenderedComponentsWithType(app, Modal)
  };
}

describe('Containers', () => {

  beforeEach(() => localStorage.clear());

  describe('Auth', () => {

    it('should display SignIn button', () => {
      const { loginButton, modals } = setup();
      expect(loginButton.textContent).toMatch(/^Sign In$/);
      TestUtils.Simulate.click(loginButton);
      expect(modals.length).toBe(0);
    });

    it('should display SignOut button', () => {
      const { loginButton } = setup({ auth: { token: true, showModal: false, fetching: false } });
      expect(loginButton.textContent).toMatch(/^Sign Out$/);
    });

    it.skip('should display Modal', () => {
      const actions = {
        onSignIn: expect.createSpy(),
        onSignOut: expect.createSpy(),
        onHideModal: expect.createSpy(),
        onReadToken: expect.createSpy(),
        onRequestToken: expect.createSpy()
      };
      const subject = shallowRender(<Auth showModal {...actions} />);
      const subjectStr = JSON.stringify(subject.props.children);
      expect(subjectStr.indexOf('form')).toNotEqual(-1);
      expect(subjectStr.indexOf('modal-footer')).toNotEqual(-1);
      // console.log(renderToString(subject));
    });

    it.skip('should not display Modal', () => {
      const actions = {
        onSignIn: expect.createSpy(),
        onSignOut: expect.createSpy(),
        onHideModal: expect.createSpy(),
        onReadToken: expect.createSpy(),
        onRequestToken: expect.createSpy()
      };
      const subject = shallowRender(<Auth fetching={false} showModal={false}
        token={false} {...actions} />);
      const subjectStr = JSON.stringify(subject.props.children);
      expect(subjectStr.indexOf('form')).toEqual(-1);
      expect(subjectStr.indexOf('modal-footer')).toEqual(-1);
    });

  });

});
